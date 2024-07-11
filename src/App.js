import './App.css';
import Home from './pages/home';
import Content from './pages/content';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Info from './pages/info';
import Header from './components/header';
import Footer from './components/footer';

export default function App() {
  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/:type/*" element={<Content />} />
        <Route path="/info/:type/:id" element={<Info />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
