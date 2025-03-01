import express, { json } from 'express';
import Docker from 'dockerode';
import tar from 'tar-fs';
import { Readable } from 'stream';
const docker = new Docker();

const app = express();
app.use(json());


async function buildCustomImage() {
  return new Promise((resolve, reject) => {
    const dockerfileContent = `
      FROM node
      RUN useradd -m myuser
      RUN echo 'myuser:mypassword' | chpasswd
    `;
    const pack = tar.pack();
    pack.entry({ name: 'Dockerfile' }, dockerfileContent);
    pack.finalize();

    docker.buildImage(pack, { t: 'custom-node-with-myuser' }, (err, response) => {
      if (err) return reject(err);
      response.on('error', (err) => reject(err));
    });
  });
}
app.get('/', (req,res)=>{res.send("Hello word")});

// Endpoint to create a container
app.post('/create-container', async (req, res) => {

  try {
    // Build the custom image
    const imageName = await buildCustomImage();

    const containerConfig = {
      Image: node, 
      Cmd: ['bash', '--login'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      OpenStdin: true,
      HostConfig: {
        AutoRemove: true,
      },
      User: 'myuser', 
    };

    // Create and start the container
    const container = await docker.createContainer(containerConfig);
    console.log(container);
    await container.start();

    // Execute additional setup commands (optional)
    const exec = await container.exec({
      Cmd: [
        'sh',
        '-c',
        `
        echo 'myuser:mypassword' | chpasswd && \
        mkdir -p /myfolder && \
        chown -R myuser:myuser /myfolder && \
        chmod -R 744 /myfolder
        `,
      ],
      AttachStdout: true,
      AttachStderr: true,
    });


    const stream = await exec.start({});
    stream.on('end', () => console.log('Setup commands completed.'));

    res.status(201).json({
      message: 'Container created successfully.',
      containerId: container.id,
      username: 'myuser',
      password: 'mypassword',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});