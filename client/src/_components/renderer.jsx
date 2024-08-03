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

  const serverAddress = 'ws://localhost:8080'
  const [ws, setWS] = useState(null)

  useEffect(() => {
    window.addEventListener('click', (e) => {
      console.log(0)
    })
  },[]);

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
      };

      ws.onclose = (e) => {
          console.log('Connection closed')
      }

      ws.onmessage = async (e) => {
          try {
            console.log(e)
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
                    onChange={(e) => setHtmlInput(e.target.value)}
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
                    onChange={(e) => setCssInput(e.target.value)}
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
