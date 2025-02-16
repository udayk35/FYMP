import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { io } from "socket.io-client";
import "xterm/css/xterm.css";

const TerminalComponent = ({ containerId }) => {
  const terminalRef = useRef(null);
  const fitAddon = new FitAddon();

  useEffect(() => {
    if (!containerId || !terminalRef.current) return; // Ensure the DOM element is available

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
      fontFamily: "monospace",
      fontSize: 14,
    });

    term.loadAddon(fitAddon);
    term.open(terminalRef.current); // Attach the terminal to the DOM element
    fitAddon.fit(); // Fit the terminal to its container

    const socket = io("ws://localhost:5000"); // Change to backend IP
    socket.emit("start_terminal", { containerId });

    // Handle incoming data from the container
    socket.on("terminal_output", (data) => {
      term.write(data); // Write container output to the terminal
    });

    // Send user input to the container
    term.onData((data) => {
      socket.emit("command", data);
    });

    // Handle terminal resize
    const resizeListener = () => {
      fitAddon.fit(); // Resize the terminal when the window is resized
    };
    window.addEventListener("resize", resizeListener);

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      term.dispose();
      window.removeEventListener("resize", resizeListener);
    };
  }, [containerId]);

  return (
    <div
      ref={terminalRef}
      style={{
        height: "100%",
        width: "100%",
        padding: "10px",
        boxSizing: "border-box",
        backgroundColor: "#1e1e1e",
      }}
    />
  );
};

export default TerminalComponent;
