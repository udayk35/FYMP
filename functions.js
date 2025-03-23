import Docker from "dockerode";
import tar from "tar-fs";
import { getInfo } from "./systeminfo.js";
import { Readable } from "stream";
import axios from 'axios';

const docker = new Docker();
// Updated provider configuration (remove ip field)
const providerConfig = {
  userID: 'user-123',
  providerID: '123456789',
  providerName: 'Edge Node 01',
  port: 5000, // Now using actual server port
  status: 'active'
};

// Heartbeat payload now only needs to send port
setInterval(async () => {
  try {
    const response = await axios.post(`http://192.168.0.104:8080/api/providers/heartbeat`, {
      ...providerConfig,
      lastHeartbeat: Date.now()
    });
    console.log(response.data);
  } catch (error) { console.log(error); }
}, 5000);


async function buildCustomImage(image) {
  return new Promise((resolve, reject) => {
    const dockerfileContent = `
      FROM ${image}
      RUN useradd -m myuser
      RUN echo 'myuser:mypassword' | chpasswd
    `;
    const pack = tar.pack();
    pack.entry({ name: "Dockerfile" }, dockerfileContent);
    pack.finalize();

    docker.buildImage(pack, { t: 'custom-node-with-myuser' }, (err, response) => {
      if (err) return reject(err);

      // Log build output
      response.on('data', (chunk) => console.log(chunk.toString()));
      response.on('end', () => resolve('custom-node-with-myuser'));
      response.on('error', (err) => reject(err));
    });
  });
}

async function listContainers(req, res) {
  try {
    const containers = await docker.listContainers({ all: true });
    return res.json({ containers: containers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function startContainer(req, res) {
  const { containerId } = req.params;
  try {
    const container = docker.getContainer(containerId);
    await container.start();
    res.json({ message: `Container ${containerId} started successfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

async function stopContainer(req, res) {
  const { containerId } = req.params;
  console.log(containerId);
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
    await container.remove();
    res.json({ message: `Container ${containerId} stopped successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function pullImage(req, res) {
  const { imageName } = req.body;
  try {
    await docker.pull(imageName);
    res.json({ message: `Image ${imageName} pulled successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createContainer(req, res) {
  const { image } = req.body;

  console.log(image);
  try {
      const container = await docker.createContainer({
        Image: image,
        Tty: true,
        AttachStdin: true, 
        OpenStdin: true,
        WorkingDir:'/app',
      });
      await container.start();
  
      res.json({ containerId:container.id});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

async function readFile(req, res) {
  const { containerId, path } = req.body;
  console.log(containerId+" "+path);
  if (!containerId || !path) {
    return res
      .status(400)
      .json({ error: "containerId and filePath are required" });
  }

  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ["cat", path],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: true });
    let fileContent = "";

    stream.on("data", (chunk) => {
      fileContent += chunk.toString();
    });

    stream.on("end", () => {
      res.json({ content: fileContent.toString("base64") });
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ error: "Failed to read file from container" });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function attachTerminal(ws, req) {
  const { containerId } = req.params;

  // Check if containerId is valid
  if (!containerId) {
    ws.send(JSON.stringify({ error: 'No containerId provided' }));
    return;
  }

  // Get the Docker container instance
  const container = docker.getContainer(containerId);
    console.log(containerId);
  // Check if container exists
  container.inspect(async (err, data) => {
    if (err || !data) {
      ws.send(JSON.stringify({ error: `No such container: ${containerId}` }));
      return;
    }

    // Create an exec instance to start a shell in the container
    const exec = await container.exec({
      Cmd: ['/bin/bash'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      WorkingDir:'/app',
    });

     exec.start({ hijack:true,stdin: true, tty: true },(err, stream) => {
      if (err) {
        ws.send(JSON.stringify({ error: err.message }));
        return;
      }
      // Send output from container to client
      stream.on('data', (chunk) => {
       const output=chunk.toString();
        console.log(output);
        ws.send(output);
      });
      stream.on('error',(err)=>console.error(err));
      // Send input from client to container
      ws.on('message',  (message) => {
        console.log(message);
        stream.write(message+'\r');
      });

      // Handle WebSocket close event
      ws.on('close', () => {
        console.log("Client disconnected.");
        stream.end(); // Close the exec stream properly when WebSocket closes
      });

      // Handle errors in WebSocket connection
      ws.on('error', (error) => {
        console.error("WebSocket Error:", error);
      });
    });
  });
}
const writeFile = async (req, res) => {
  const { containerId, path, content } = req.body;
  console.log(content + " " + path);
  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ["sh", "-c", `echo '${content}' > ${path}`],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: true });
    stream.on("data", () => { });
    stream.on("end", () => res.json({ message: "File saved successfully" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// List files in a directory
const listFiles = async (req, res) => {
  const { containerId, path } = req.body;
  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ['ls', path],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: true });
    let output = '';
    
    stream.on('data', (chunk) => (output += chunk.toString()));
    stream.on('end', () => {
      res.json({ files: output })});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getSystemInfo(req, res) {
  try{
    const info = await getInfo();
    console.log(info);
    res.json(info);
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
} 

export {
  buildCustomImage,
  listContainers,
  startContainer,
  stopContainer,
  pullImage,
  createContainer,
  readFile,
  attachTerminal,
  writeFile,
  listFiles,
};
