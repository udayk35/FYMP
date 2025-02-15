import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Terminal = ({ containerId }) => {
  const [socket, setSocket] = useState(null);
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");

  useEffect(() => {
    if (!containerId) return;

    const newSocket = io("ws://localhost:5000"); // Change to backend IP
    setSocket(newSocket);

    newSocket.emit("start_terminal", { containerId });

    newSocket.on("terminal_output", (data) => {
      setOutput((prev) => prev + data);
    });

    return () => newSocket.disconnect();
  }, [containerId]);

  const sendCommand = () => {
    if (socket && command.trim() !== "") {
      console.log("Sending command:", command);
      socket.emit("command", command);
      setCommand(""); // Clear input after sending
    }
  };

  return (
    <div>
      <pre
        style={{
          background: "black",
          color: "white",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {output}
      </pre>
      <input
        type='text'
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder='Type a command...'
      />
      <button onClick={sendCommand}>Send</button>
    </div>
  );
};

export default Terminal;
