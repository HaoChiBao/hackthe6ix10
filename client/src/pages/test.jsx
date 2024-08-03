import "./test.css";
import { useEffect, useState } from "react";

const Test = () => {
  const [innerText, setInnerText] = useState("...");
  const serverAddress = "ws://localhost:8080";
  const [ws, setWS] = useState(null);

  const TEST_ROOM = "TEST_ROOM";

  const testFunc = () => {
    return;
    ws.send(
      JSON.stringify({
        action: "TEST",
        data: [{ test: "test" }, { test: "test" }, { test: "test" }],
      })
    );
  };

  const handleSubmit = () => {
    console.log(innerText);
    sendWS({
      action: "generateNew",
      data: {
        prompt: innerText,
        html: "",
        css: "",
      },
    });
  };

  const sendWS = (message) => {
    try {
      if (ws === null) {
        console.log("Websocket is not connected");
        return;
      }
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const initiate_WS = async () => {
      if (ws === null) {
        // retrieve data from the server
        setWS(new WebSocket(serverAddress));
        return;
      }

      console.log("Connecting to the server...");

      ws.onopen = () => {
        console.log("Connected to the server");
        ws.send(
          JSON.stringify({
            action: "join_project",
            data: {
              roomID: TEST_ROOM,
            },
          })
        );
      };

      ws.onclose = (e) => {
        console.log("Connection closed");
      };

      ws.onmessage = async (e) => {
        try {
          const data = JSON.parse(e.data);
          const action = data.action;
          switch (action) {
            case "Welcome":
              // console.log(data)
              break;
            case "generateNew":
              console.log(data);
              const prompt = data.data.prompt;
              const response = document.querySelector(".response");
              response.innerHTML = prompt;
              break;
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      ws.onerror = (e) => {
        console.error("Error:", e);
      };
    };
    initiate_WS();
  }, [ws]);

  return (
    <div className="App" onClick={testFunc}>
      <textarea
        className="test2"
        onChange={(e) => setInnerText(e.target.value)}
      >
        {innerText}
      </textarea>

      <button onClick={handleSubmit}>Submit</button>

      <div className="response">...</div>
    </div>
  );
};

<<<<<<< HEAD
export default Test;
=======
        ws.onmessage = async (e) => {
            try {
                const data = JSON.parse(e.data)
                const action = data.action
                switch(action){
                    case 'Welcome':
                        // console.log(data)
                        break
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }

        ws.onerror = (e) => {
            console.error('Error:', e)
        }
        }
        initiate_WS()
        
    },[ws])

    return (
        <div className="App" onClick={testFunc}>

            <textarea className="test2" onChange={(e) => setInnerText(e.target.value)}>
                {innerText}
            </textarea>

            <button onClick={handleSubmit}>Submit</button>

            <div className="response">
                ...
            </div>

        </div>
    )
}

export default Test
>>>>>>> main
