import DOMPurify from "dompurify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import cursorAsset from "../assets/cursor.png";

import "./renderer.css";

export default function Renderer({ id }) {
  const [htmlInput, setHtmlInput] = useState(``);
  const [cssInput, setCssInput] = useState(``);
  const [projectName, setProjectName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const iframeRef = useRef(null);

  const [input, setInput] = useState(``);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [activeTab, setActiveTab] = useState("html");

  const [sanitizedHTML, setSanitizedHTML] = useState(
    DOMPurify.sanitize(htmlInput)
  );

  const [innerText, setInnerText] = useState("...");
  let serverAddress = "ws://localhost:8080";
  // serverAddress = "ws://hack-the-6ix10.glitch.me/";
  const [ws, setWS] = useState(null);

  const TEST_ROOM = "TEST_ROOM";

  const testFunc = () => {
    ws.send(
      JSON.stringify({
        action: "TEST",
        data: [{ test: "test" }, { test: "test" }, { test: "test" }],
      })
    );
  };

  const updateCursor = (cursor, id) => {
    let cursorElement = document.getElementById(id);
    if (cursorElement === null || cursorElement === undefined) {
      // create a new cursor element
      cursorElement = document.createElement("div");
      cursorElement.className = "client-cursor";
      cursorElement.id = id;

      const cursorImage = document.createElement("img");
      cursorImage.src = cursorAsset;
      cursorElement.appendChild(cursorImage);

      const colours = ["red", "blue", "green", "purple", "orange", "pink"];
      const color = colours[Math.floor(Math.random() * colours.length)];
      // filter: drop-shadow(1.3px 0 0 red)
      //       drop-shadow(0 1.3px 0 red)
      //       drop-shadow(-1.3px 0 0 red)
      //       drop-shadow(0 -1.3px 0 red);
      cursorElement.style.filter = `drop-shadow(1.3px 0 0 ${color}) drop-shadow(0 1.3px 0 ${color}) drop-shadow(-1.3px 0 0 ${color}) drop-shadow(0 -1.3px 0 ${color})`;

      document.body.appendChild(cursorElement);
    }
    cursorElement.style.left = cursor.x + "px";
    cursorElement.style.top = cursor.y + "px";
    // console.log(cursorElement)
  };

  const handleMouseMove = (e) => {
    const cursor = {
      x: e.clientX,
      y: e.clientY,
    };

    sendWS({
      action: "updateCursor",
      data: {
        cursor,
      },
    });
  };

  const handleHTMLDown = (e) => {

  }

  const handleCSSDown = (e) => {

  }

  // Update the innerHTML of the div
  const updateHTML = (html) => {
    setHtmlInput(html);
  };

  const updateCSS = (css) => {
    setCssInput(css);
  };

  const sendWS = (message) => {
    try {
      if (ws === null) {
        console.log("Websocket is not connected");
        return;
      }
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Send WS Error");
      // console.error('Error:', error)
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
          const message = JSON.parse(e.data);
          const action = message.action;
          const data = message.data;
          // console.log(message)
          switch (action) {
            case "Welcome":
              // console.log(data)
              break;
            case "updateHTML":
              const html = data.html;
              updateHTML(html);
              break;
            case "updateCSS":
              const css = data.css;
              updateCSS(css);
              break;
            case "updateCursor":
              const cursor = data.cursor;
              const id = data.id;
              updateCursor(cursor, id);
              break;
            case "client_disconnected":
              const client_id = data.ws_id;
              const client_cursor = document.getElementById(client_id);
              if (client_cursor !== null) {
                client_cursor.remove();
              }
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

  useEffect(() => {
    console.log("ID:" + id);
    const fetchData = async () => {
      try {
        const projectNameDoc = await getDoc(doc(db, "projects", id));

        const htmlDoc = await getDoc(doc(db, "projects", id, "files", "html"));
        const cssDoc = await getDoc(doc(db, "projects", id, "files", "css"));

        if (htmlDoc.exists()) {
          setHtmlInput(htmlDoc.data().value);
        }

        if (cssDoc.exists()) {
          setCssInput(cssDoc.data().value);
        }

        if (projectNameDoc.exists()) {
          setProjectName(projectNameDoc.data().name);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchData();
  }, [id]);

  const changeInnerCSS = (e) => {
    const css = e.target.value;
    updateCSS(css);

    sendWS({
      action: "updateCSS",
      data: {
        css,
      },
    });
  };

  const changeInnerHTML = (e) => {

    const html = e.target.value;
    updateHTML(html);

    sendWS({
      action: "updateHTML",
      data: {
        html,
      },
    });
  };

  useEffect(() => {
    const iframeDocument = iframeRef.current?.contentDocument;
    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(`
        <html>
          <head>
            <style>${DOMPurify.sanitize(cssInput)}</style>
          </head>
          <body>${DOMPurify.sanitize(htmlInput)}</body>
        </html>
      `);
      iframeDocument.close();
    }
  }, [htmlInput, cssInput]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      setRecognition(rec);
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      console.log(
        "Speech recognition started. Try speaking into the microphone."
      );
    }
    setIsRecording(!isRecording);
  };
  const handleDeploy = async () => {
    console.log("Deploying project...");
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "projects", id, "files", "html"), {
        value: htmlInput,
      });

      await updateDoc(doc(db, "projects", id, "files", "css"), {
        value: cssInput,
      });

      console.log("HTML and CSS saved successfully!");
    } catch (error) {
      console.error("Error saving files:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleNameKeyDown = async (e) => {
    if (e.key === "Enter") {
      try {
        await updateDoc(doc(db, "projects", id), {
          name: projectName,
        });
        setIsEditingName(false);
      } catch (error) {
        console.error("Error updating project name:", error);
      }
    }
  };

  return (
    <main onMouseMove={handleMouseMove}>
      <div className="top-bar">
        <Link className="back-button" to="/">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
        <div onClick={handleNameClick}>
          {isEditingName ? (
            <input
              type="text"
              value={projectName}
              onChange={handleNameChange}
              onKeyDown={handleNameKeyDown}
              onBlur={() => setIsEditingName(false)}
              className="project-name-input"
              autoFocus
            />
          ) : (
            <p className="project-name">{projectName}</p>
          )}
        </div>
        <div className="button-container">
          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button
            type="submit"
            onClick={handleDeploy}
            className="render-button"
          >
            Deploy
          </button>
        </div>
      </div>
      <div className="interface">
        <div className="code-panel">
          <div>
            <div className="tab-container">
              <div className="tabs">
                <div
                  className={activeTab === "html" ? "tab-active" : "tab"}
                  onClick={() => handleTabClick("html")}
                >
                  HTML
                </div>
                <div
                  className={activeTab === "css" ? "tab-active" : "tab"}
                  onClick={() => handleTabClick("css")}
                >
                  CSS
                </div>
              </div>
            </div>
            <form className="form">
              {activeTab === "html" && (
                <div className="field">
                  <textarea
                    id="html"
                    value={htmlInput}
                    onChange={changeInnerHTML}
                    onMouseDown={handleHTMLDown}
                    rows="20"
                    cols="50"
                  />
                </div>
              )}

              {activeTab === "css" && (
                <div className="field">
                  <textarea
                    id="css"
                    value={cssInput}
                    onChange={changeInnerCSS}
                    onMouseDown={handleCSSDown}
                    rows="20"
                    cols="50"
                  />
                </div>
              )}
            </form>
          </div>
          <div className="prompt-container">
            <input
              value={input}
              className="input"
              onChange={(e) => setInput(e.target.value)}
              placeholder="ex. Make a website for a flower shop"
            />
            <button type="button" onClick={toggleRecording}>
              {isRecording ? "Stop Talking" : "Start Talking"}
            </button>
          </div>
        </div>
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </main>
  );
}
