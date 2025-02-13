import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import Docker from "dockerode";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed
    methods: ["GET", "POST"],
  },
});

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

app.use(cors());
app.use(express.json());

// API to list running containers
app.get("/api/docker/containers", async (req, res) => {
  try {
    const containers = await docker.listContainers();
    res.json(containers);
  } catch (err) {
    console.error("Error fetching containers:", err);
    res.status(500).json({ error: "Error fetching containers" });
  }
});

// WebSocket connection for interactive terminal
io.on("connection", (socket) => {
  console.log("Client connected to WebSocket");

  socket.on("start_terminal", async ({ containerId }) => {
    if (!containerId) {
      socket.emit("terminal_error", { error: "No container ID provided" });
      return;
    }

    try {
      const container = docker.getContainer(containerId);
      const exec = await container.exec({
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: true,
        Tty: true,
        Cmd: ["/bin/sh"],
      });

      const stream = await exec.start({ hijack: true, stdin: true });

      stream.on("data", (chunk) => {
        socket.emit("terminal_output", chunk.toString());
      });

      socket.on("command", (command) => {
        console.log(`Executing command: ${command}`);
        stream.write(command + "\n");
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        stream.end();
      });
    } catch (err) {
      console.error("Error starting terminal:", err);
      socket.emit("terminal_error", { error: "Error starting terminal" });
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
