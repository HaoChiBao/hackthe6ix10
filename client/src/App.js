import { Routes, Route } from 'react-router-dom';
import './App.css';

import Test from './pages/test';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
