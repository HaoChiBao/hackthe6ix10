import DOMPurify from "dompurify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ArrowLeft,
  EyeIcon,
  Mic,
  MicIcon,
  MicOffIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import cursorAsset from "../assets/cursor.png";
import "./renderer.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";

import debounce from "lodash.debounce";

export default function Renderer({ id }) {
  const [htmlInput, setHtmlInput] = useState(``);
  const [cssInput, setCssInput] = useState(``);
  const htmlEditorRef = useRef();
  const [projectName, setProjectName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const iframeRef = useRef(null);
  const [input, setInput] = useState(``);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [activeTab, setActiveTab] = useState("html");
  const [activeIframe, setActiveIframe] = useState("iframe1");
  const [selectedElement, setSelectedElement] = useState(null);

  const [sanitizedHTML, setSanitizedHTML] = useState(
    DOMPurify.sanitize(htmlInput)
  );

  const [innerText, setInnerText] = useState("...");

  // let serverAddress = "ws://localhost:8080";
  const serverAddress = "wss://hackthe6ix-e92731233d9a.herokuapp.com/";
  const [ws, setWS] = useState(null);

  const navigate = useNavigate();

  const TEST_ROOM = "TEST_ROOM";

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

  // Debounced functions
  const debouncedUpdateHTML = debounce((html) => {
    setHtmlInput(html);
  }, 10);

  const debouncedUpdateCSS = debounce((css) => {
    setCssInput(css);
  }, 10);

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
              debouncedUpdateHTML(data.html);
              break;
            case "updateCSS":
              debouncedUpdateCSS(data.css);
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
            case "newCode":
              const newHTML = data.new_html;
              const newCSS = data.new_css;
              console.log("New code received:", newHTML, newCSS);
              setHtmlInput(newHTML);
              setCssInput(newCSS);
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

  const changeInnerCSS = (value) => {
    setCssInput(value);
    sendWS({
      action: "updateCSS",
      data: {
        css: value,
      },
    });
  };

  const changeInnerHTML = (value) => {
    setHtmlInput(value);
    sendWS({
      action: "updateHTML",
      data: {
        html: value,
      },
    });
  };
  const handleIframeMouseOver = (e) => {
    const element = e.target;
    console.log("Mouse over element:", element);
    const rect = element.getBoundingClientRect();
    element.style.outline = "2px dashed #7B70F5";
    element.style.cursor = "default";

    const html = iframeRef.current.contentDocument.documentElement.outerHTML;
    const elementHtml = element.outerHTML;

    // Create or update tooltip
    let tooltip = document.getElementById("tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "tooltip";
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "#fff";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.padding = "4px";
      tooltip.style.zIndex = "1000";
      tooltip.style.pointerEvents = "none";
      document.body.appendChild(tooltip);
    }

    // Update tooltip content
    tooltip.innerHTML = `
        <p>${element.tagName.toLowerCase()}</p>
        
    `;

    // Position tooltip
    const iframeRect = iframeRef.current.getBoundingClientRect();
    tooltip.style.left = `${rect.left + iframeRect.left + window.scrollX}px`;
    tooltip.style.top = `${
      rect.top + iframeRect.top + window.scrollY - tooltip.offsetHeight
    }px`;
    tooltip.style.display = "block";
  };

  const handleIframeMouseOut = (e) => {
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      tooltip.style.display = "none";
    }

    const element = e.target;
    element.style.outline = "none";

    // clearHighlight();
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
          <body style="min-height: 1000px;">${DOMPurify.sanitize(
            htmlInput
          )}</body>
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

  const updateIframeContent = (iframeId, html, css) => {
    const iframe = document.getElementById(iframeId);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <style>${css}</style>
      ${html}
    `);
    doc.close();
  };

  const debouncedUpdate = debounce((html, css) => {
    const nextIframe = activeIframe === "iframe1" ? "iframe2" : "iframe1";
    updateIframeContent(nextIframe, html, css);
    setActiveIframe(nextIframe);
  }, 500);

  useEffect(() => {
    debouncedUpdate(htmlInput, cssInput);
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

  const handleSubmit = () => {
    console.log(input, htmlInput, cssInput);
    sendWS({
      action: "generateNew",
      data: {
        prompt: input,
        html: htmlInput,
        css: cssInput,
      },
    });
  };

  return (
    <main onMouseMove={handleMouseMove}>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          display: "none",
          backgroundColor: "#ffffff90",
          fontSize: "12px",
          border: "1px solid #ccc",
          padding: "2px 4px",
          borderRadius: "4px",
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
            <SaveIcon size={16} />
          </button>
          {/* <button
            onClick={() => navigate(`/live/${id}`)}
            className="save-button"
          >
            <EyeIcon size={16} />
          </button> */}
          <Link to={`/live/${id}`} target="_blank" className="deply-button">
            <button
              target="_blank"
              type="submit"
              onClick={handleDeploy}
              className="deploy-button"
            >
              <RocketIcon size={16} style={{ marginRight: "8px" }} />
              Deploy
            </button>
          </Link>
        </div>
      </div>
      <div className="interface">
        <div className="code-panel">
          <div className="code-container">
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
            {activeTab === "html" ? (
              <CodeMirror
                className="code-mirror"
                value={htmlInput}
                options={{
                  mode: "xml",
                  theme: "default",
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  changeInnerHTML(value);
                }}
                editorDidMount={(editor) => {
                  editor.setValue(htmlInput);
                }}
              />
            ) : (
              <CodeMirror
                className="code-mirror"
                value={cssInput}
                options={{
                  mode: "css",
                  theme: "default",
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  changeInnerCSS(value);
                }}
                editorDidMount={(editor) => {
                  editor.setValue(cssInput);
                }}
              />
            )}
          </div>
          <div className="prompt-container">
            <div style={{ position: "relative", width: "100%" }}>
              <input
                value={input}
                className="input"
                onChange={(e) => setInput(e.target.value)}
                placeholder="ex. Make a website for a flower shop"
              />
              <button
                style={{
                  position: "absolute",
                  right: "0rem",
                  top: "0.5rem",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "2.25rem",
                  width: "2.25rem",
                  padding: "0",

                  outline: isRecording ? "4px solid #7B70F5" : "none",
                }}
                type="button"
                onClick={toggleRecording}
              >
                {isRecording ? <MicOffIcon size={16} /> : <MicIcon size={16} />}
              </button>
            </div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        <div id="iframe-container">
          <iframe
            id="iframe1"
            ref={iframeRef}
            className={`iframe ${
              activeIframe === "iframe1" ? "visible" : "hidden"
            }`}
          ></iframe>
          <iframe
            ref={iframeRef}
            id="iframe2"
            className={`iframe ${
              activeIframe === "iframe2" ? "visible" : "hidden"
            }`}
          ></iframe>
        </div>
      </div>
    </main>
  );
}
