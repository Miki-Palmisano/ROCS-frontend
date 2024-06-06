import './App.css';
import Home from './pages/home';
import Film from './pages/film';
import Serie from './pages/serie';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film" element={<Film />} />
        <Route path="/serie" element={<Serie />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}
