const WebSocket = require("ws");
const Docker = require("dockerode");

const docker = new Docker();

const attachTerminal = (ws, req) => {
  const { containerId } = req.params;
  console.log("🔗 Connecting to container:", containerId);

  if (!containerId) {
    ws.send(JSON.stringify({ error: "No containerId provided" }));
    ws.close();
    return;
  }

  const container = docker.getContainer(containerId);

  container.inspect((err, data) => {
    if (err || !data) {
      console.error("❌ Error finding container:", err);
      ws.send(JSON.stringify({ error: `No such container: ${containerId}` }));
      ws.close();
      return;
    }

    container.exec(
      {
        Cmd: ["/bin/sh"], // Change to "/bin/bash" if needed
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      },
      (err, exec) => {
        if (err) {
          ws.send(JSON.stringify({ error: err.message }));
          ws.close();
          return;
        }

        exec.start({ hijack: true, stdin: true, tty: true }, (err, stream) => {
          if (err) {
            ws.send(JSON.stringify({ error: err.message }));
            ws.close();
            return;
          }

          console.log("✅ Terminal attached to container!");

          // Send container output to WebSocket
          container.modem.demuxStream(
            stream,
            {
              write: (data) => {
                console.log("📤 Container Output:", data.toString()); // Debug log
                ws.send(data.toString()); // Send output to frontend
              },
            },
            ws
          );

          // Listen for commands from frontend
          ws.on("message", (message) => {
            console.log(`✉️ Received command from frontend: ${message}`);
            stream.write(message + "\n"); // Send command to container
          });

          // Handle WebSocket closure
          ws.on("close", () => {
            console.log("⚠️ WebSocket closed");
            stream.end();
          });

          ws.on("error", (err) => {
            console.error("❌ WebSocket error:", err);
            stream.end();
          });
        });
      }
    );
  });
};

module.exports = { attachTerminal };
