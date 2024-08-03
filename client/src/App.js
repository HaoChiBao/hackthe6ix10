import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Test from "./pages/test.jsx";
import Project from "./pages/project.jsx";
import Home from "./pages/home.jsx";
import GitHubAuth from "./auth/auth.jsx";

function App() {
  return (
    <>
      <nav>
        <Link to="/">websitify</Link>
        <GitHubAuth />
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test" element={<Test />} />
        <Route path="/:projectId" element={<Project />} />
      </Routes>
    </>
  );
}

export default App;
