// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const protobuf = require('protobufjs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3001;
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';

// --- Protobuf Setup ---
let TickerList; // the Protobuf TickerList message type
let TickerUpdate; // the Protobuf TickerUpdate message type

// Load Protobuf .proto file
protobuf.load('proto/market_data.proto', (err, root) => {
    if (err) {
        console.error('Failed to load protobuf:', err);
        process.exit(1);
    }
    TickerList = root.lookupType('market_data.TickerList');
    TickerUpdate = root.lookupType('market_data.TickerUpdate');
    console.log('Protobuf schema loaded successfully.');
});
// --- End Protobuf Setup ---


// --- Binance WebSocket Connection ---
let binanceWs;
const tickerCache = new Map(); // Stores the latest price for each symbol

function connectToBinanceWebSocket() {
    console.log('Attempting to connect to Binance WebSocket...');
    binanceWs = new WebSocket(BINANCE_WS_URL);

    binanceWs.onopen = () => {
        console.log('Connected to Binance WebSocket.');
    };

    binanceWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
            data.forEach(ticker => {
                // 's' is symbol, 'c' is last price, 'E' is event time
                tickerCache.set(ticker.s, {
                    lastPrice: ticker.c,
                    eventTime: ticker.E
                });
            });
        }
    };

    binanceWs.onerror = (error) => {
        console.error('Binance WebSocket Error:', error);
    };

    binanceWs.onclose = (event) => {
        console.warn('Binance WebSocket Closed:', event.code, event.reason);
        setTimeout(connectToBinanceWebSocket, 5000);
    };
}

connectToBinanceWebSocket(); // Initiate connection to Binance

// --- Our WebSocket Server (for clients) ---

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to our WebSocket. Total clients:', clients.size);

    // Send current cached data to new client immediately
    sendTickerUpdatesToClients();

    // Handle messages from this specific client
    ws.on('message', (message) => { 
        const messageString = message.toString();
        console.log(`Received message from client: "${messageString}"`);

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(`Echo: ${messageString}`);
        }
        // broadcast to all clients:
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(`Other clients say: ${messageString}`);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected from our WebSocket. Total clients:', clients.size);
    });

    ws.on('error', (error) => {
        console.error('Client WebSocket Error:', error);
    });
});

// --- Broadcasting Logic ---
// Send updates to all connected clients periodically
setInterval(() => {
    sendTickerUpdatesToClients();
}, 1000); // Broadcast every 1 second

function sendTickerUpdatesToClients() {
    if (!TickerList || !TickerUpdate) {
        console.warn('Protobuf types not loaded yet. Skipping broadcast.');
        return;
    }

    const updates = [];
    const desiredSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT']; // Filter for specific symbols

    desiredSymbols.forEach(symbol => {
        const cached = tickerCache.get(symbol);
        if (cached) {
            updates.push(TickerUpdate.create({
                symbol: symbol,
                lastPrice: cached.lastPrice,
                eventTime: cached.eventTime
            }));
        }
    });

    if (updates.length === 0) {
        return;
    }

    // Create a TickerList message
    const payload = TickerList.create({ tickers: updates });

    const errMsg = TickerList.verify(payload);
    if (errMsg) {
        console.error('Protobuf payload validation failed:', errMsg);
        return;
    }

    // Encode the payload to binary
    const buffer = TickerList.encode(payload).finish();

    // Broadcast to all connected clients
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(buffer); // Send the binary Protobuf message
        }
    });
}


// Serve node_modules so that the browser can access protobufjs/minimal.js
app.use('/node_modules', express.static('node_modules'));

// --- Express Static File Serving ---
app.use(express.static('public')); // Serve index.html, script.js, style.css


// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});