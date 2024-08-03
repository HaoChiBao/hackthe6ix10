import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";

export default function Renderer() {
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

  const projectId = "sZiN5fts7q0ATyvnIo4c";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNameDoc = await getDoc(doc(db, "projects", projectId));

        const htmlDoc = await getDoc(
          doc(db, "projects", projectId, "files", "html")
        );
        const cssDoc = await getDoc(
          doc(db, "projects", projectId, "files", "css")
        );

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
  }, [projectId]);

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

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "projects", projectId, "files", "html"), {
        value: htmlInput,
      });

      await updateDoc(doc(db, "projects", projectId, "files", "css"), {
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
        await updateDoc(doc(db, "projects", projectId), {
          name: projectName,
        });
        setIsEditingName(false);
      } catch (error) {
        console.error("Error updating project name:", error);
      }
    }
  };

  return (
    <main>
      <header>websitify</header>
      <div className="top-bar">
        <button className="back-button">
          <ArrowLeft size={16} />
          Back to Projects
        </button>
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
            onClick={handleSubmit}
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
