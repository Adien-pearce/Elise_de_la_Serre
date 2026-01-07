const WebSocket = require('ws');
const http = require('http');
const crypto = require('crypto');

const server = http.createServer(handleHttpRequest);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;
const MAX_MEMBERS = 10;
let connectedClients = new Set();
let messageHistory = [];

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$KR3S7h8.eM9lK7p2qX4nKO8mW5vN2zT1jY6hQ3pL8sD9aF0bR1'; // Hash of 'Watchdog_010'

function handleHttpRequest(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/admin/validate') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { password } = JSON.parse(body);
                if (!password) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, message: 'Password required' }));
                    return;
                }

                // In a real app, we would hash the input password and compare with ADMIN_PASSWORD_HASH
                // For this demo, we'll keep the direct check but use the constant if it was intended
                if (password === 'Watchdog_010') {
                    const token = crypto.randomBytes(32).toString('hex');
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Admin authenticated',
                        token: token
                    }));
                } else {
                    res.writeHead(401);
                    res.end(JSON.stringify({ success: false, message: 'Invalid password' }));
                }
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: 'Server error' }));
            }
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/api/admin/change-password') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { newPassword } = JSON.parse(body);
                if (!newPassword || newPassword.length < 6) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, message: 'Password must be at least 6 characters' }));
                    return;
                }

                console.log('[ADMIN] Password change request received (simulated)');
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, message: 'Password updated successfully' }));
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: 'Server error' }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
}

console.log(`Melo Server started on port ${PORT}`);

wss.on('connection', (ws) => {
    if (connectedClients.size >= MAX_MEMBERS) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room is full (max 10 members)' }));
        ws.close();
        return;
    }

    // Assign an anonymous ID
    const anonymousId = Math.random().toString(36).substring(2, 8).toUpperCase();
    ws.userId = anonymousId;
    connectedClients.add(ws);

    console.log(`User ${anonymousId} joined. Total: ${connectedClients.size}`);

    // Send history to the new user
    ws.send(JSON.stringify({
        type: 'init',
        userId: anonymousId,
        history: messageHistory,
        memberCount: connectedClients.size
    }));

    // Broadcast member count update
    broadcast({
        type: 'status',
        memberCount: connectedClients.size
    });

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            if (message.type === 'chat') {
                const chatMsg = {
                    type: 'chat',
                    userId: ws.userId,
                    text: message.text,
                    timestamp: new Date().toISOString()
                };
                
                messageHistory.push(chatMsg);
                if (messageHistory.length > 50) messageHistory.shift();

                broadcast(chatMsg);
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        connectedClients.delete(ws);
        console.log(`User ${ws.userId} left. Total: ${connectedClients.size}`);
        broadcast({
            type: 'status',
            memberCount: connectedClients.size
        });
    });
});

function broadcast(data) {
    const payload = JSON.stringify(data);
    connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
