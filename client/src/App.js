import "./App.css";
import {Routes, Route} from "react-router-dom";

import Test from "./pages/test.jsx";
import Renderer from "./_components/renderer.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Renderer />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;
