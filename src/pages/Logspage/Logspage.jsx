import React, { useState } from "react";
import { Table } from "../../components/Table/Table.jsx";
import "./Logspage.css";

const sharedResources = [
  { userId: "U123", username: "JohnDoe", containerId: "abc123", imageName: "nginx", startTime: "2024-03-04 10:00", endTime: "2024-03-04 12:00" },
  { userId: "U456", username: "JaneSmith", containerId: "def456", imageName: "mysql", startTime: "2024-03-04 11:00", endTime: "2024-03-04 13:30" }
];

const usedResources = [
  { providerId: "P789", username: "Alice", containerId: "ghi789", imageName: "redis", startTime: "2024-03-04 14:00", endTime: "2024-03-04 16:00" }
];

export const LogsTable = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div 
    className="logpage relative h-screen bg-cover bg-center overflow-hidden flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('/signup-in.png')" }}>
      {isLoggedIn ? (
        <div className="log-card bg-white w-3/4 shadow-2xl rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Resources Shared To</h2>
          <Table className="table" data={sharedResources} type="shared" />
          <h2 className="text-xl font-semibold mt-6 mb-4">Resources Used From</h2>
          <Table className="table" data={usedResources} type="used" />
        </div>
      ):<h1>
        Please Login to See logs
        </h1>
        }
    </div>
  );
};

