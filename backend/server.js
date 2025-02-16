import http from "http";
import { Server } from "socket.io";
import Docker from "dockerode";
import app from "./app.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

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
        stream.write(command);
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
