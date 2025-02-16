import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  FaPlus,
  FaSave,
  FaPlay,
  FaTimes,
  FaSyncAlt,
  FaPowerOff,
} from "react-icons/fa";
import TerminalComponent from "./Terminal.jsx";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Workspace = ({ containerId, setContainerId, API_URL }) => {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const response = await axios.post(
        API_URL + "/api/docker/files/list",
        { containerId, dirPath: "/" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(response.data.files.split("\n"));
    } catch (err) {
      console.error(err.message);
    }
  };

  const readFile = async (file) => {
    try {
      const newFile = file.replace(/[^\x20-\x7E]/g, "");
      const response = await axios.post(
        API_URL + "/api/docker/files/read",
        { containerId, filePath: "/" + newFile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const cleanedContent = response.data.content.replace(
        /[^\x20-\x7E\n\r]/g,
        ""
      );
      setCurrentFile(newFile);
      setFileContent(cleanedContent.slice(1));
    } catch (err) {
      console.error(err);
    }
  };

  const saveFile = async () => {
    if (!currentFile) {
      const newFile = prompt("Please enter a file name:");
      setCurrentFile(newFile);
      if (!newFile) {
        alert("File name cannot be empty");
        return;
      }
    }
    try {
      await axios.post(
        API_URL + "/api/docker/files/write",
        { containerId, filePath: "/" + currentFile, content: fileContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const exit = async () => {
    try {
      await axios.post(
        API_URL + `/api/docker/containers/${containerId}/stop`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContainerId(""); // Reset containerId to go back to "Create Container" options
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px",
          background: "#1e1e1e",
          color: "#fff",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => {
            saveFile();
            setCurrentFile("");
            setFileContent("");
          }}
        >
          <FaPlus />
        </button>
        <button onClick={saveFile}>
          <FaSave />
        </button>
        <button onClick={() => alert("Run")}>
          <FaPlay />
        </button>
        <button onClick={exit}>
          <FaTimes />
        </button>
        <button onClick={fetchFiles}>
          <FaSyncAlt />
        </button>
        {/* Disconnect Button */}
        <button onClick={exit} style={{ marginLeft: "auto" }}>
          <FaPowerOff /> Disconnect
        </button>
      </div>

      {/* Main Content */}
      <PanelGroup direction='horizontal' style={{ flex: 1 }}>
        {/* File Explorer */}
        <Panel
          defaultSize={20}
          minSize={10}
          style={{ background: "#252526", color: "#fff" }}
        >
          <div style={{ padding: "10px" }}>
            <h3>File Explorer</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {files.map((file, index) => (
                <li
                  key={index}
                  onClick={() => readFile(file)}
                  style={{
                    cursor: "pointer",
                    fontSize: "1rem",
                    borderBottom: "1px solid grey",
                    padding: "5px 0",
                  }}
                >
                  {file.replace(/[^\x20-\x7E]/g, "")}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <PanelResizeHandle style={{ width: "5px", background: "#1e1e1e" }} />
        {/* Terminal */}
        <Panel style={{ background: "#1e1e1e", padding: "10px" }}>
          <TerminalComponent containerId={containerId} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Workspace;
