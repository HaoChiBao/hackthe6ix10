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
  // const serverAddress = "ws://localhost:8080";
  const serverAddress = "ws://hack-the-6ix10.glitch.me/";
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
      cursorElement = document.createElement("div");
      cursorElement.className = "client-cursor";
      cursorElement.id = id;

      const cursorImage = document.createElement("img");
      cursorImage.src = cursorAsset;
      cursorElement.appendChild(cursorImage);

      const colours = ["red", "blue", "green", "purple", "orange", "pink"];
      const color = colours[Math.floor(Math.random() * colours.length)];
      cursorElement.style.filter = `drop-shadow(1.3px 0 0 ${color}) drop-shadow(0 1.3px 0 ${color}) drop-shadow(-1.3px 0 0 ${color}) drop-shadow(0 -1.3px 0 ${color})`;

      document.body.appendChild(cursorElement);
    }
    cursorElement.style.left = cursor.x + "px";
    cursorElement.style.top = cursor.y + "px";
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
    }
  };

  useEffect(() => {
    const initiate_WS = async () => {
      if (ws === null) {
        setWS(new WebSocket(serverAddress));
        return;
      }

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            action: "join_project",
            data: {
              roomID: TEST_ROOM,
            },
          })
        );
      };

      ws.onclose = (e) => {};

      ws.onmessage = async (e) => {
        try {
          const message = JSON.parse(e.data);
          const action = message.action;
          const data = message.data;
          switch (action) {
            case "Welcome":
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
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
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

      iframeDocument.addEventListener("mouseover", handleIframeMouseOver);
      iframeDocument.addEventListener("mouseout", handleIframeMouseOut);
    }

    return () => {
      if (iframeDocument) {
        iframeDocument.removeEventListener("mouseover", handleIframeMouseOver);
        iframeDocument.removeEventListener("mouseout", handleIframeMouseOut);
      }
    };
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

  const handleIframeMouseOver = (e) => {
    const element = e.target;
    const rect = element.getBoundingClientRect();
    element.style.outline = "1px solid #3b32a0";
    element.style.borderRadius = "4px";
    element.style.cursor = "default";

    const html = iframeRef.current.contentDocument.documentElement.outerHTML;
    const elementHtml = element.outerHTML;

    highlightCode(elementHtml);
  };

  const handleIframeMouseOut = (e) => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";

    const element = e.target;
    element.style.outline = "none";

    clearHighlight();
  };

  const highlightCode = (elementHtml) => {
    // Remove the style attribute from the elementHtml
    const elementHtmlWithoutStyle = elementHtml.replace(/ style="[^"]*"/g, "");

    const textarea = document.getElementById(
      activeTab === "html" ? "html" : "css"
    );

    const code = htmlInput;
    const startIndex = code.indexOf(elementHtmlWithoutStyle);
    console.log(code, startIndex, elementHtmlWithoutStyle);

    if (startIndex !== -1) {
      textarea.setSelectionRange(
        startIndex,
        startIndex + elementHtmlWithoutStyle.length
      );
      textarea.focus();
    }
  };

  const clearHighlight = () => {
    const textarea = document.getElementById(
      activeTab === "html" ? "html" : "css"
    );
    textarea.setSelectionRange(0, 0);
    textarea.blur();
  };

  return (
    <main onMouseMove={handleMouseMove}>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          display: "none",
          backgroundColor: "yellow",
          padding: "5px",
          borderRadius: "5px",
        }}
      ></div>
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
