
import axios from 'axios';
import WebSocket from 'ws';

const providers = new Map();

const handleHeartbeat = (req, res) => {
    const {
        userID,
        providerID,
        providerName,
        port,
        containerID,
        status = 'active'
    } = req.body;

    const ip = req.headers['x-forwarded-for'] || req.ip;
    const providerKey = `${providerID}`;

    let ws = providers.get(providerKey)?.ws;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        const wsURL = `ws://${ip}:${port}`;
        ws = new WebSocket(wsURL);

        ws.on('open', () => {
            console.log(`WebSocket connected to ${wsURL}`);
        });

        ws.on('message', (message) => {
            console.log(`Message from ${providerKey}:`, message.toString());
        });

        ws.on('close', () => {
            console.log(`WebSocket closed for provider ${providerKey}`);
            providers.delete(providerKey);  // Remove provider when disconnected
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error for provider ${providerKey}:`, error);
        });
    }

    providers.set(providerKey, {
        userID,
        providerID,
        providerName,
        ip,
        port,
        containerID,
        status,
        ws,
        lastHeartbeat: Date.now(),
        registeredAt: new Date().toISOString()
    });

    res.json({ 
        status: 'ACK',
        timestamp: Date.now() 
    });
};



const getAllProviders = (req, res) => {
    res.json(Array.from(providers.values()));
};

const getProviderById = (req, res) => {
    const provider = Array.from(providers.values()).find(
        p => p.providerID === req.params.providerId
    );
    res.json(provider || { error: 'Provider not found' });
};

const cleanupProviders = (timeout = 30000) => {
    const now = Date.now();
    for (const [key, provider] of providers.entries()) {
        if (now - provider.lastHeartbeat > timeout) {
            providers.delete(key);
            console.log(`Removed inactive provider: ${key}`);
        }
    }
};

const startContainer =async (req,res)=>{
    try {
        const { providerId } = req.params;
        const { containerId } = req.body;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.post(
            `http://${provider.ip}:${provider.port}/containers/start`,
            { containerId },
            { timeout: 5000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to start container',
            details: error.message
        });
    }
}
const stopContainer = async (req,res)=>{
    try {
        const { providerId } = req.params;
        const { containerId } = req.body;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.post(
            `http://${provider.ip}:${provider.port}/containers/stop`,
            { containerId },
            { timeout: 5000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to stop container',
            details: error.message
        });
    }
}

const pullImage = async (req,res)=>{
    try {
        const { providerId } = req.params;
        const { image } = req.body;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.post(
            `http://${provider.ip}:${provider.port}/images/pull`,
            { image },
            { timeout: 15000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to pull image',
            details: error.message
        });
    }
}

const createContainer = async (req,res)=>{
    try {
        const { providerId } = req.params;
        const { image, options } = req.body;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.post(
            `http://${provider.ip}:${provider.port}/containers/create`,
            { image, options },
            { timeout: 10000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create container',
            details: error.message
        });
    }

}

const getSystemInfo = async (req,res)=>{
    try {
        const { providerId } = req.params;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.get(
            `http://${provider.ip}:${provider.port}/system/info`,
            { timeout: 3000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get system info',
            details: error.message
        });
    }
}

const readFile = async (req,res) =>{
    try {
        const { providerId } = req.params;
        const { path } = req.query;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.get(
            `http://${provider.ip}:${provider.port}/files/read`,
            { params: { path }, timeout: 5000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to read file',
            details: error.message
        });
    }
}
const listFiles = async (req,res) =>{
    try {
        const { providerId } = req.params;
        const { path } = req.query;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.get(
            `http://${provider.ip}:${provider.port}/files/list`,
            { params: { path }, timeout: 5000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to list files',
            details: error.message
        });
    }
}

const writeFile = async (req,res) =>{
    try {
        const { providerId } = req.params;
        const { path, content } = req.body;
        const provider = getProviderById(providerId);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const response = await axios.post(
            `http://${provider.ip}:${provider.port}/files/write`,
            { path, content },
            { timeout: 5000 }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to write file',
            details: error.message
        });
    }
}
const attachTerminal = (ws, req) => {
    const { containerID, providerID } = req.params;

    if (!containerID || !providerID) {
        ws.send(JSON.stringify({ error: "Missing containerID or providerID" }));
        ws.close();
        return;
    }

    const provider = providers.get(providerID);

    if (!provider || !provider.ws || provider.ws.readyState !== WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: "Provider not available or WebSocket not connected" }));
        ws.close();
        return;
    }

    console.log(`Attaching terminal for container ${containerID} on provider ${providerID}`);

    // Handle messages from the client and forward them to the provider
    ws.on("message", (message) => {
        console.log(`Command from client: ${message}`);
        provider.ws.send(JSON.stringify({ containerID, command: message }));
    });

    // Handle messages from the provider and relay them to the client
    provider.ws.on("message", (data) => {
        try {
            const response = JSON.parse(data);
            if (response.containerID === containerID) {
                ws.send(response.output); // Send the container output back to the client
            }
        } catch (err) {
            console.error("Invalid response from provider:", data);
        }
    });

    // Handle WebSocket close events
    ws.on("close", () => {
        console.log("Client disconnected from terminal session.");
    });

    ws.on("error", (error) => {
        console.error("WebSocket Error:", error);
    });
};
export {
    handleHeartbeat,
    getAllProviders,
    getProviderById,
    cleanupProviders,
    providers,


    startContainer,
    stopContainer,
    createContainer,
    pullImage,
    getSystemInfo,
    


    readFile,
    listFiles,
    writeFile,

    attachTerminal
};





