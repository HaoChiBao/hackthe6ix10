// websocket express server
const express = require("express");
const http = require("http");
const { send } = require("process");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (if needed)
app.use(express.static("public"));

// add cors
app.use(cors());

// Broadcast to all connected clients, except the sender
function broadcast(ws, message) {
    try {
        if(ws.roomID === null) return;
        projects_ids[ws.roomID].clients.forEach((client) => {
            // wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
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
    broadcast(
      ws,
      JSON.stringify({
        action: "client_left",
        data: {
          ws_id: ws.id,
        },
      })
    );

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

    broadcast(
      ws,
      JSON.stringify({
        action: "client_joined",
        data: {
          ws_id: ws.id,
          ws_roomID: ws.roomID,
        },
      })
    );

    const clients = projects_ids[id].clients.map((client) => {
      return {
        ws_id: client.id,
      };
    });
    ws.send(JSON.stringify({
      action: "project_joined",
      data: {
        // filter ws_id from clients
        clients: clients.filter((client) => client.ws_id !== ws.id),
      }
    }))

  } catch (error) {
    console.error("Error:", error);
  }
};

let chat_ws = null;

// WebSocket connection handling
wss.on("connection", (ws) => {
  // generate unique id for each client
  ws.id = Math.random().toString(36).substr(2, 9);
  ws.roomID = null;
  console.log(`Client id: ${ws.id} connected`);

  ws.send(JSON.stringify({
    action: 'Welcome',
    data: {
      ws_id: ws.id,
    }
  }))

  try {
    // ChatGPT
    // const chat_ws_address = "ws://127.0.0.1:8000/ws";
    const chat_ws_address = "wss://c9bf-138-51-82-224.ngrok-free.app/ws";
    chat_ws = new WebSocket(chat_ws_address);

    // Open WebSocket connection
    chat_ws.on("open", function open() {
      console.log("ChatGPT WebSocket connection opened");
      //   console.log(chat_ws);
    });

    // Listen for messages from the server
    chat_ws.on("message", function incoming(message) {
      // console.log("ChatGPT WebSocket message:", data);

      try {
        const messageObj = JSON.parse(message);
        const action = messageObj.action;
        const data = messageObj.data;
        console.log("New data is: ", data);
        switch (action) {
          case "generateNew":
            // const html = data.html;
            // const css = data.css;
            const prompt = data.prompt;
            ws.send(
              JSON.stringify({
                action: "generateNew",
                data: {
                  prompt: prompt,
                  // html: html,
                  // css: css,
                },
              })
            );
            // broadcast(
            //   ws,
            //   JSON.stringify({
            //     action: "generateNew",
            //     data: {
            //       //   html: html,
            //       //   css: css,
            //       prompt: prompt,
            //     },
            //   })
            // );
            break;
        }
      } catch (error) {
        console.error("Error:", error);
      }
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

  ws.on("message", (message) => {
    try {
      const messageObj = JSON.parse(message);
      const action = messageObj.action;
      const data = messageObj.data;
      switch (action) {
        case "TEST":
          // console.log(messageObj)
          // ws.send(JSON.stringify(messageObj))
          console.log(projects_ids);
          break;
        case "active_clients_imgs":
          console.log("Active Clients: ", projects_ids[ws.roomID].clients);
          const room_clients = projects_ids[ws.roomID].forEach((client) => {
            return client.imgSrc;
          })
          console.log("Room Clients: ", room_clients);
          break;
        case "join_project":
          const roomID = data.roomID;
          joinProject(roomID,ws);
          break;
        case "leave_project":
          leaveProject(ws.roomID, ws);
          break;

        case "updateHTML":
          const html = data.html;
          broadcast(
            ws,
            JSON.stringify({
              action: "updateHTML",
              data: {
                html: html,
              },
            })
          );
          break;
        case "generateNew":
          // get the data from the client side
          const prompt = data.prompt;
          const HTML = data.html;
          const cssText = data.css;
          console.log("Prompt:", prompt);
          //   console.log("chatws is: ", chat_ws);
          if (chat_ws) {
            chat_ws.send(
              JSON.stringify({
                action: "generateNew",
                data: {
                  prompt: prompt,
                  HTML: HTML,
                  css: cssText,
                },
              })
            );
          } else {
            console.log("ChatGPT WebSocket is not connected");
          }
          //   broadcast(
          //     ws,
          //     JSON.stringify({
          //       action: "generateNew",
          //       data: {
          //         prompt: html,
          //       },
          //     })
          //   );
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
        
        case "updateBlinkingCursor":
            console.log("Blinking Cursor: ", data.position);
            const position = data.position;
            broadcast(
                ws,
                JSON.stringify({
                action,
                data: {
                    position,
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
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
