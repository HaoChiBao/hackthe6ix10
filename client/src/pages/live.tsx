import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Renderer({ id }) {
  const [htmlInput, setHtmlInput] = useState(``);
  const [cssInput, setCssInput] = useState(``);
  const [projectName, setProjectName] = useState("");

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

  return <main></main>;
}
