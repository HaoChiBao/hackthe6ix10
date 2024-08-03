import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from Firebase
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsRef);
        const projectsData = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <header>websitify</header>
      <h1>Projects</h1>
      {projects.map((project) => (
        <Link key={project.id} to={`/${project.id}`}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default Home;
