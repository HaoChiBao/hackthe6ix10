// websocket express server
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (if needed)
app.use(express.static('public'));

// Broadcast to all connected clients, except the sender
function broadcast(ws, message) {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const projects_ids = {
    'TEST_ID': {
        clients: []
    }
}

// seerver

// WebSocket connection handling
wss.on('connection', (ws) => {
    // generate unique id for each client
    ws.id = Math.random().toString(36).substr(2, 9);
    console.log(`Client id: ${ws.id} connected`);

    // Send a welcome message
    ws.send(
        // send as buffer
        JSON.stringify({
            action: 'Welcome',
            data: ws.id,
        })
    );
    
    ws.on('message', (message) => {
        const messageObj = JSON.parse(message)
        const action = messageObj.action
        const data = messageObj.data
        switch(action){
            case 'TEST':
                console.log('TEST')
                break
        }
        
        // Broadcast the message to all clients
        // broadcast(ws, message);
    });
    
    ws.on('close', () => {
        console.log(`Client: ${ws.id} disconnected`);

        // Broadcast the message to all clients
        // client_rooms[room].clients.forEach((client) => {
        //     client.send(
        //         JSON.stringify({
        //             action: 'user_disconnect',
        //             data: ws.id,
        //             timeStamp: Date.now()
        //         })
        //     );
        // });

    });
    
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
