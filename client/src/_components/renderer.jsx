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

import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import defaultPfp0 from "../assets/cat.png";
import defaultPfp1 from "../assets/panda.png";
import defaultPfp2 from "../assets/rabbit.png";

import debounce from "lodash.debounce";

const pfpList = [defaultPfp0, defaultPfp1, defaultPfp2];

const SessionClient = ({ imgSrc, id }) => {
  useEffect(() => {
    if (imgSrc === null) {
      // imgSrc = "https://www.gravatar.com/avatar/
      console.log(0);
    }
  }, []);
  return (
    <div className="session-client" id={`${id}-pfp`}>
      <img src={imgSrc} alt="Client" />
    </div>
  );
};

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
  const [activeIframe, setActiveIframe] = useState("iframe1");

  const [sessionClients, setSessionClients] = useState([
    // {imgSrc: defaultPfp0},
    // {imgSrc: defaultPfp1, id : "1"},
    // {imgSrc: defaultPfp2, id : "2"},
  ]);

  const [blinkingPosition, setBlinkingPosition] = useState({ x: 0, y: 0 });

  const [sanitizedHTML, setSanitizedHTML] = useState(
    DOMPurify.sanitize(htmlInput)
  );

  const [innerText, setInnerText] = useState("...");
  // let serverAddress = "ws://localhost:8080";
  const serverAddress = "wss://hackthe6ix-e92731233d9a.herokuapp.com/";

  const [user, setUser] = useState(null);
  const [ws, setWS] = useState(null);

  const createSessionClient = (id) => {
    const sessionClient = document.createElement("div");
    sessionClient.className = "session-client";
    sessionClient.id = id + "-pfp";

    const img = document.createElement("img");
    img.src = pfpList[Math.floor(Math.random() * pfpList.length)];
    sessionClient.appendChild(img);

    const activeClients = document.getElementsByClassName("active-clients")[0];
    activeClients.appendChild(sessionClient);
    return sessionClient;
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User:", user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    console.log("Session Clients:", sessionClients);
  }, [sessionClients]);

  const navigate = useNavigate();

  const TEST_ROOM = "TEST_ROOM";

  const sendWS = (message) => {
    try {
      if (ws === null) {
        // console.log("Websocket is not connected");
        throw new Error("Websocket is not connected");
        return;
      }
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Send WS Error");
    }
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

  // const handleClientBlinkingCursor = (e) => {
  //   // console.log(e.getCursor())
  //   // console.log(e.listSelections())
  //   try {
  //     const position = e.getCursor();
  //     const line = position.line;
  //     const ch = position.ch;

  //     console.log(line, ch)
  //     // console.log(position)
  //     // const { top, left } = getCaretCoordinates(textInput, position);
  //     // console.log(top, left)

  //     sendWS({
  //         action: "updateBlinkingCursor",
  //         data: {
  //             position: { x: ch, y: line },
  //             // position: { x: left, y: top },
  //         }
  //     })
  //   } catch (error) {
  //     console.error("Error updating cursor position:", error);
  //   }
  // }

  //   useEffect(() => {
  //     if (blinkingPosition === null) return;
  //     try {
  //       const position = blinkingPosition.getCursor();
  //       const line = position.line;
  //       const ch = position.ch;

  //       console.log(line, ch);
  //       // console.log(position)
  //       // const { top, left } = getCaretCoordinates(textInput, position);
  //       // console.log(top, left)

  //       sendWS({
  //         action: "updateBlinkingCursor",
  //         data: {
  //           position: { x: ch, y: line },
  //           // position: { x: left, y: top },
  //         },
  //       });
  //     } catch (error) {
  //       // console.error("Error updating cursor position:", error);
  //     }
  //   }, [blinkingPosition]);

  const getCaretCoordinates = (element, position) => {
    const div = document.createElement("div");
    const text = element.value.substring(0, position);
    const styles = getComputedStyle(element);
    const bounding = element.getBoundingClientRect();

    for (const prop of styles) {
      div.style[prop] = styles[prop];
    }

    div.style.position = "absolute";
    div.style.whiteSpace = "pre-wrap";
    div.style.visibility = "hidden";
    div.textContent = text;
    document.body.appendChild(div);

    const span = document.createElement("span");
    span.textContent = element.value[position] || ".";
    div.appendChild(span);

    const { offsetTop: top, offsetLeft: left } = span;
    document.body.removeChild(div);

    return { top: top + bounding.top, left };
  };

  // Update the innerHTML of the div
  const updateHTML = (html) => {};
  // Debounced functions
  const debouncedUpdateHTML = debounce((html) => {
    setHtmlInput(html);
  }, 10);

  const debouncedUpdateCSS = debounce((css) => {
    setCssInput(css);
  }, 10);

  useEffect(() => {
    const initiate_WS = async () => {
      if (ws === null) {
        setWS(new WebSocket(serverAddress));
        return;
      }

      ws.onopen = () => {
        console.log("Connected to the server");
        const client_cursors = document.getElementsByClassName("client-cursor");
        while (client_cursors.length > 0) {
          client_cursors[0].remove();
        }

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
        const client_cursors = document.getElementsByClassName("client-cursor");
        while (client_cursors.length > 0) {
          client_cursors[0].remove();
        }
      };

      ws.onmessage = async (e) => {
        try {
          const message = JSON.parse(e.data);
          const action = message.action;
          const data = message.data;
          switch (action) {
            case "Welcome":
              console.log("Welcome to the server", data.ws_id);
              ws.id = data.ws_id;
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
            case "project_joined":
              const clients = data.clients;
              clients.forEach((client) => {
                const current_session_client = createSessionClient(client.id);
              });
              console.log("Clients:", clients);
              break;
            // case "updateBlinkingCursor":
            //   const position = data.position;
            //   const blink_id = data.id;
            //   console.log("Blinking Cursor: ", position);
            //   updateBlinkingCursor(position, blink_id);
            //   break;
            case "client_joined":
              console.log("Client Joined");
              const join_id = data.ws_id;
              // const client_imgSrc = data.imgSrc;
              const new_session_client = createSessionClient(join_id);
              break;
            case "client_disconnected":
              const client_id = data.ws_id;
              const client_cursor = document.getElementById(
                client_id + "-cursor"
              );
              if (client_cursor !== null) {
                client_cursor.remove();
              }

              const session_client = document.getElementById(
                client_id + "-pfp"
              );
              if (session_client !== null) {
                session_client.remove();
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
        const client_cursors = document.getElementsByClassName("client-cursor");
        while (client_cursors.length > 0) {
          client_cursors[0].remove();
        }
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
    const rect = element.getBoundingClientRect();
    element.style.outline = "2px dashed #7B70F5";
    element.style.borderRadius = "4px";
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

    // highlightCode(elementHtml);
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
  }, 300);

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
          <div className="active-clients">
            {/* {(sessionClients.length > 0) && sessionClients.map((client) => {
              return <SessionClient imgSrc={client.imgSrc} />
            })} */}
          </div>

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
            </form>
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
            className={`iframe ${
              activeIframe === "iframe1" ? "visible" : "hidden"
            }`}
          ></iframe>
          <iframe
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
