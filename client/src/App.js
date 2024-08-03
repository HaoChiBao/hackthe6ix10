import Renderer from "./_components/renderer.jsx";
import "./App.css";
import {Routes, Route} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Renderer />} />
    </Routes>
  );
}

export default App;
