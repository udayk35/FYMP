import React from "react";
import "./Table.css";

export const Table = ({ data, type }) => {
    return (
      <div className="logtable overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {type === "shared" && <th className="border border-gray-300 px-4 py-2">User ID</th>}
              {type === "used" && <th className="border border-gray-300 px-4 py-2">Provider ID</th>}
              {type === "shared" && <th className="border border-gray-300 px-4 py-2">User Name</th>}
              {type === "used" && <th className="border border-gray-300 px-4 py-2">Provider Name</th>}
              <th className="border border-gray-300 px-4 py-2">Container ID</th>
              <th className="border border-gray-300 px-4 py-2">Image Name</th>
              <th className="border border-gray-300 px-4 py-2">Start Time</th>
              <th className="border border-gray-300 px-4 py-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {type === "shared" && <td className="border border-gray-300 px-4 py-2">{log.userId}</td>}
                {type === "used" && <td className="border border-gray-300 px-4 py-2">{log.providerId}</td>}
                <td className="border border-gray-300 px-4 py-2">{log.username}</td>
                <td className="border border-gray-300 px-4 py-2">{log.containerId}</td>
                <td className="border border-gray-300 px-4 py-2">{log.imageName}</td>
                <td className="border border-gray-300 px-4 py-2">{log.startTime}</td>
                <td className="border border-gray-300 px-4 py-2">{log.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };