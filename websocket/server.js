// websocket express server
const express = require("express");
const http = require("http");
<<<<<<< HEAD
const { send } = require("process");
=======
>>>>>>> main
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
<<<<<<< HEAD

let chat_ws = null;
=======
>>>>>>> main

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

<<<<<<< HEAD
  try {
    // ChatGPT
    chat_ws = new WebSocket("ws://127.0.0.1:8000/ws");

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
        case "join_project":
          const roomID = data.roomID;
          joinProject(roomID, ws);
          break;
        case "leave_project":
          leaveProject(ws.roomID, ws);
          break;

=======
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

>>>>>>> main
        case "updateHTML":
          const html = data.html;
          broadcast(
            ws,
            JSON.stringify({
<<<<<<< HEAD
              action: "updateHTML",
              data: {
                html: html,
=======
              action,
              data: {
                html,
>>>>>>> main
              },
            })
          );
          break;
<<<<<<< HEAD
        case "generateNew":
          // get the data from the client side
          const prompt = data.prompt;
          const HTML = data.html;
          const css = data.css;
          console.log("Prompt:", prompt);
          //   console.log("chatws is: ", chat_ws);
          if (chat_ws) {
            chat_ws.send(
              JSON.stringify({
                action: "generateNew",
                data: {
                  prompt: prompt,
                  HTML: HTML,
                  css: css,
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
=======
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
>>>>>>> main
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
<<<<<<< HEAD
    leaveProject(ws.roomID, ws);

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
=======
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
>>>>>>> main
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//GITHUB API

const createRepo = async (repoName) => {
  const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // Replace with your actual token
  const url = "https://api.github.com/user/repos";

  const data = {
    name: repoName,
    description: "This is your new repository",
    private: false, // or true if you want to create a private repository
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const repo = await response.json();
  console.log("Repository created:", repo);
};

createRepo("my-new-repo");
