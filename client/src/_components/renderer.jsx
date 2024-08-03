import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

export default function Renderer() {
  const [htmlInput, setHtmlInput] = useState(``);
  const [cssInput, setCssInput] = useState(``);
  const iframeRef = useRef(null);

  const [input, setInput] = useState(``);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [activeTab, setActiveTab] = useState("html");

  const [sanitizedHTML, setSanitizedHTML] = useState(
    DOMPurify.sanitize(htmlInput)
  );

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      // console.log(e.x, e.y)
    })
  },[]);
  const [innerText, setInnerText] = useState("...")
  const serverAddress = 'ws://localhost:8080'
  const [ws, setWS] = useState(null)

  const TEST_ROOM = 'TEST_ROOM'

  const testFunc = () => {
      ws.send(JSON.stringify({
          action: 'TEST',
          data: [
              {'test': 'test'},
              {'test': 'test'},
              {'test': 'test'}
          ]
      }))
  }

  // Update the innerHTML of the div
  const updateHTML = (html) => {
      setHtmlInput(html)
  }

  const updateCSS = (css) => {
      setCssInput(css)
  }

  const sendWS = (message) => {
      try {
          if(ws === null) {
              console.log('Websocket is not connected')
              return
          }
          ws.send(JSON.stringify(message))
      } catch (error) {
          console.error('Error:', error)
      }
  }

  useEffect(() => {
      
      const initiate_WS = async () => {
      if(ws === null) {
          // retrieve data from the server 
          setWS(new WebSocket(serverAddress))
          return
      } 

      console.log('Connecting to the server...')

      ws.onopen = () => {
          console.log('Connected to the server');
          ws.send(JSON.stringify({
              action: 'join_project',
              data: {
                  roomID: TEST_ROOM
              }
          }))
      };

      ws.onclose = (e) => {
          console.log('Connection closed')
      }

      ws.onmessage = async (e) => {
          try {
              const message = JSON.parse(e.data)
              const action = message.action
              const data = message.data
              console.log(message)
              switch(action){
                  case 'Welcome':
                      // console.log(data)
                      break
                  case 'updateHTML':
                      const html = data.html
                      updateHTML(html)
                      break
                  case 'updateCSS':
                      const css = data.css
                      updateCSS(css)
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

  const changeInnerCSS = (e) => {
      const css = e.target.value
      updateCSS(css)

      sendWS({
          action: 'updateCSS',
          data: {
              css
          }
      })
  }

  const changeInnerHTML = (e) => {
      // find textfield selectionstart and selectionend
      const selectionStart = e.target.selectionStart
      const selectionEnd = e.target.selectionEnd
      console.log(selectionStart, selectionEnd)

      const html = e.target.value
      updateHTML(html)
      
      sendWS({
          action: 'updateHTML',
          data: {
              html
          }
      })
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSanitizedHTML(DOMPurify.sanitize(htmlInput));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <main>
      <header>websitify</header>
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
              <button
                type="submit"
                onClick={handleSubmit}
                className="render-button"
              >
                Render
              </button>
            </div>
            <form className="form" onSubmit={handleSubmit}>
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
