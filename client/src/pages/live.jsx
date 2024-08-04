import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function Live() {
  const [htmlInput, setHtmlInput] = useState("");
  const [cssInput, setCssInput] = useState("");
  const [projectName, setProjectName] = useState("");

  const iframeRef = useRef(null);
  const { projectId } = useParams();

  useEffect(() => {
    if (!projectId) {
      return;
    }

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

  return (
    <div>
      <main>
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100vh", border: "none" }}
          title="Live Preview"
        />
      </main>
    </div>
  );
}
