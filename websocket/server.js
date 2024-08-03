// websocket express server
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (if needed)
app.use(express.static("public"));

// Broadcast to all connected clients, except the sender
function broadcast(ws, message) {
  projects_ids[ws.roomID].clients.forEach((client) => {
    // wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const projects_ids = {
  TEST_ID: {
    clients: [],
  },
};

const createProject = (id) => {
  try {
    projects_ids[id] = {
      clients: [],
    };
  } catch (error) {
    console.error("Error:", error);
  }
};

const deleteProject = (id) => {
  try {
    delete projects_ids[id];
  } catch (error) {
    console.error("Error:", error);
  }
};

const leaveProject = (id, ws) => {
  try {
    if (projects_ids[id] === undefined || projects_ids[id] === null) return;
    projects_ids[id].clients = projects_ids[id].clients.filter(
      (client) => client !== ws
    );
    ws.roomID = null;
    if (projects_ids[id].clients.length === 0) deleteProject(id);
  } catch (error) {
    console.error("Error:", error);
  }
};

const joinProject = (id, ws) => {
  try {
    if (projects_ids[id] === undefined || projects_ids[id] === null)
      createProject(id);
    projects_ids[id].clients.push(ws);
    ws.roomID = id;
  } catch (error) {
    console.error("Error:", error);
  }
};

// WebSocket connection handling
wss.on("connection", (ws) => {
  // generate unique id for each client
  ws.id = Math.random().toString(36).substr(2, 9);
  ws.roomID = null;
  console.log(`Client id: ${ws.id} connected`);

  // Send a welcome message
  ws.send(
    // send as buffer
    JSON.stringify({
      action: "Welcome",
      data: {
        ws_id: ws.id,
        ws_roomID: ws.roomID,
      },
    })
  );

  /* 
    
    {
        action: 'join_project',
        data: {
            TEST: TEST_ID
        }
    }

    */

  ws.on("message", (message) => {
    try {
      const messageObj = JSON.parse(message);
      const action = messageObj.action;
      const data = messageObj.data;
      // console.log(messageObj)
      switch (action) {
        case "TEST":
          // console.log(messageObj)
          // ws.send(JSON.stringify(messageObj))
          console.log(projects_ids);
          break;
        case "join_project":
          const roomID = data.roomID;
          joinProject(roomID, ws);
          break;
        case "leave_project":
          leaveProject(ws.roomID, ws);
          break;

        case "updateHTML":
          const html = data.html;
          broadcast(
            ws,
            JSON.stringify({
              action,
              data: {
                html,
              },
            })
          );
          break;
        case "updateCSS":
          const css = data.css;
          broadcast(
            ws,
            JSON.stringify({
              action,
              data: {
                css,
              },
            })
          );
          break;

        case "updateCursor":
          const cursor = data.cursor;
          broadcast(
            ws,
            JSON.stringify({
              action,
              data: {
                cursor,
                id: ws.id,
              },
            })
          );
          break;
      }

      //
      ws.send(
        JSON.stringify({
          action: "message_received",
          data: {
            ws_id: ws.id,
            ws_roomID: ws.roomID,
          },
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }

    // Broadcast the message to all clients
    // broadcast(ws, message);
  });

  ws.on("close", () => {
    console.log(`Client: ${ws.id} disconnected`);
    broadcast(
      ws,
      JSON.stringify({
        action: "client_disconnected",
        data: {
          ws_id: ws.id,
        },
      })
    );
    leaveProject(ws.roomID, ws);
  });

  return;
  try {
    // ChatGPT
    let chat_ws = new WebSocket("ws://127.0.0.1:8000/ws/generateHTML");

    // Open WebSocket connection
    chat_ws.on("open", function open() {
      console.log("WebSocket connection opened");
      console.log(chat_ws);
      // Send a prompt to the server
      const prompt = {
        prompt:
          "Generate HTML for a simple webpage with a header, footer, and a main section.",
      };
      chat_ws.send(JSON.stringify(prompt));
    });

    // Listen for messages from the server
    chat_ws.on("message", function incoming(data) {
      console.log("Received:", data);
    });

    // Handle WebSocket errors
    chat_ws.on("error", function error(err) {
      console.log("WebSocket error:", err);
    });

    // Handle WebSocket close event
    chat_ws.on("close", function close() {
      console.log("WebSocket connection closed");
    });
  } catch (error) {
    console.log("CHAT_WS Error:", error);
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
