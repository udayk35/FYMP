import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function DockerCreate({ setContainerId }) {
  const [containers, setContainers] = useState([]);
  const [imageName, setImageName] = useState("");
  const [containerName, setContainerName] = useState("");
  const [hostPort, setHostPort] = useState("");
  const [containerPort, setContainerPort] = useState("");

  const fetchContainers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/docker/containers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContainers(response.data.containers);
    } catch (err) {
      console.error(err);
    }
  };

  const pullImage = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/docker/images/pull",
        { imageName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Image ${imageName} pulled successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  const createContainer = async () => {
    try {
      const token = localStorage.getItem("token");
      const portBindings = {
        [`${containerPort}/tcp`]: [{ HostPort: hostPort }],
      };

      const response = await axios.post(
        "http://localhost:5000/api/docker/containers/create",
        { imageName, containerName, portBindings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContainerId(response.data.container_id);
      alert(`Container ${containerName} created and started successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='container mt-4'>
      <h2>Docker Consumer</h2>
      <button className='btn btn-primary mb-3' onClick={fetchContainers}>
        Fetch Containers
      </button>
      <ul className='list-group mb-3'>
        {containers.map((container) => (
          <li key={container.Id} className='list-group-item'>
            {container.Names[0]} - {container.State}
          </li>
        ))}
      </ul>
      <div className='mb-3'>
        <h3>Pull Image</h3>
        <input
          type='text'
          className='form-control mb-2'
          placeholder='Image name'
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
        <button className='btn btn-success' onClick={pullImage}>
          Pull Image
        </button>
      </div>
      <div>
        <h3>Create Container</h3>
        <input
          type='text'
          className='form-control mb-2'
          placeholder='Image name'
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
        <input
          type='text'
          className='form-control mb-2'
          placeholder='Container name'
          value={containerName}
          onChange={(e) => setContainerName(e.target.value)}
        />
        <input
          type='text'
          className='form-control mb-2'
          placeholder='Host port'
          value={hostPort}
          onChange={(e) => setHostPort(e.target.value)}
        />
        <input
          type='text'
          className='form-control mb-2'
          placeholder='Container port'
          value={containerPort}
          onChange={(e) => setContainerPort(e.target.value)}
        />
        <button className='btn btn-primary' onClick={createContainer}>
          Create Container
        </button>
      </div>
    </div>
  );
}

export default DockerCreate;
