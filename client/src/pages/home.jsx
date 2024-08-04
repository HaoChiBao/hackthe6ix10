import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { PlusIcon } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, "projects");
        const projectsQuery = query(projectsRef, orderBy("lastModified"));
        console.log("Projects Query:", projectsQuery);
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
        console.log("Projects:", projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const createProject = async () => {
    try {
      const newProject = {
        name: "New Project",
        user: user.displayName,
        lastModified: Timestamp.now(),
      };

      // Add new project to "projects" collection
      const docRef = await addDoc(collection(db, "projects"), newProject);

      // Create "files" subcollection within the new project document
      const filesCollectionRef = collection(db, "projects", docRef.id, "files");

      // Add "html" and "css" documents to the "files" subcollection
      await setDoc(doc(filesCollectionRef, "html"), { value: "" });
      await setDoc(doc(filesCollectionRef, "css"), { value: "" });

      // Navigate to the new project page
      navigate(`/${docRef.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="projects-header">
          <h1>Projects</h1>
          <button
            onClick={createProject}
            style={{ display: "flex", alignContent: "center", gap: "8px" }}
          >
            <PlusIcon size={20} />
            Create Project
          </button>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <Project
              key={project.id}
              id={project.id}
              name={project.name}
              user={project.user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Project = ({ id, name, user }) => {
  return (
    <Link key={id} to={`/${id}`} className="card">
      <h2>{name}</h2>
      <p>{user}</p>
    </Link>
  );
};

export default Home;
