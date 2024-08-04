import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Test from "./pages/test.jsx";
import Project from "./pages/project.jsx";
import Home from "./pages/home.jsx";
import GitHubAuth from "./auth/auth.jsx";
import Live from "./pages/live.jsx";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/live" &&
        !location.pathname.startsWith("/live/") && (
          <nav>
            <Link to="/">__init__()</Link>
            <GitHubAuth />
          </nav>
        )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/:projectId" element={<Project />} />
        <Route path="/live/:projectId" element={<Live />} />
      </Routes>
    </>
  );
}

export default App;
