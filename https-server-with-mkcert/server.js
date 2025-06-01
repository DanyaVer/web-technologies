const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PORT = 8443;
const CERT_PATH = path.join(__dirname, 'localhost.pem');
const KEY_PATH = path.join(__dirname, 'localhost-key.pem');

// Verifying that certificate and key files exist
if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
    console.error('Error: Certificate or key file not found.');
    console.error(`Please ensure 'localhost.pem' and 'localhost-key.pem' are in the same directory as 'server.js'.`);
    console.error(`You can generate them using 'mkcert localhost' in this directory.`);
    process.exit(1);
}

const options = {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
    // Force TLS 1.2
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.2',

    // Force RSA key exchange ciphers (used to decrypt traffic in Wireshark)
    ciphers: 'TLS_RSA_WITH_AES_256_CBC_SHA256:TLS_RSA_WITH_AES_128_CBC_SHA256',
    
    // Log errors in TLS negotiation
    honorCipherOrder: true,
};

// --- Create the HTTPS server ---
const server = https.createServer(options, (req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);

    if (req.method === 'GET' && req.url === '/hello') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello from TLS 1.2 RSA server!\n');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
    }
});

// --- Start the server ---
server.listen(PORT, 'localhost', () => {
    console.log(`Server running on https://localhost:${PORT}`);
    console.log(`Try accessing: https://localhost:${PORT}/hello`);
    console.log(`For Wireshark decryption, remember the private key path: ${KEY_PATH}`);
});

// Handle TLS errors (in case it happens)
server.on('tlsClientError', (err, socket) => {
    console.error('TLS Client Error:', err.message);
    socket.destroy();
});

server.on('error', (err) => {
    console.error('Server Error:', err.message);
});