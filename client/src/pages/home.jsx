import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import GitHubAuth from "../auth/auth";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsRef);
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

    return () => unsubscribe();
  }, []);

  return (
    <div>
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
