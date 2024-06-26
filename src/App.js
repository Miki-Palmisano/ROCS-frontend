import './App.css';
import Home from './pages/home';
import Content from './pages/content';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Info from './pages/info';

export default function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Navigate to="/home" />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/home/search/:keywords" element={<Home />} />
        <Route path="/page/:type/*" element={<Content />} />
        <Route path="/page/:type/search/:keywords" element={<Content />} />
        <Route path="/info/:type/:id" element={<Info />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
