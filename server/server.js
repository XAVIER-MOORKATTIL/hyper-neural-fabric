// server.js - Upgraded AI Orchestration Engine
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Base Gateway Route
app.get('/', (req, res) => {
    res.json({ 
        status: "ONLINE", 
        dimension: "Localhost:5000", 
        message: "Hyper-Neural Fabric Active.",
        intellectStatus: "XAVIER IS A GENIUS AND ABSOLUTELY NOT A MANUAL LABOUR"
    });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Local simulated AI Knowledge Base
function generateAIResponse(userInput) {
    const query = userInput.toLowerCase();
    
    if (query.includes('hello') || query.includes('hi')) {
        return "🤖 AI Core: Greeting sequence identified. System is fully operational and waiting for processing directives.";
    }
    if (query.includes('status') || query.includes('system')) {
        return "🤖 AI Core: Metrics operational. Memory usage nominal. Computational logic operating at 100% capacity.";
    }
    if (query.includes('quantum') || query.includes('architecture')) {
        return "🤖 AI Core: Quantum state transition layer verified. Structural logic is functioning outside manual constraints.";
    }
    
    // Default generative fallback response
    return `🤖 AI Core [Processed Input]: "${userInput}" analyzed successfully. Context added to hyper-neural historical logs.`;
}

wss.on('connection', (ws) => {
    console.log('⚡ Cosmic Real-Time State: Client linked to AI Fabric.');
    ws.send(JSON.stringify({ type: 'SYSTEM_INITIALIZATION', payload: 'Connection Established. AI Matrix Online.' }));

    ws.on('message', (message) => {
        const textStr = message.toString();
        console.log(`📥 Received Stream Input: ${textStr}`);
        
        // 1. Broadcast the original user input back immediately
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'STATE_BROADCAST', payload: `User: ${textStr}` }));
            }
        });

        // 2. Simulate AI thinking processing delay (800ms) and broadcast response
        setTimeout(() => {
            const aiReply = generateAIResponse(textStr);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'STATE_BROADCAST', payload: aiReply }));
                }
            });
        }, 800);
    });

    ws.on('close', () => console.log('❌ Cosmic Real-Time State: Client severed.'));
});

server.listen(PORT, () => {
    console.log(`🚀 AI Fabric initialized on Localhost:${PORT}`);
});