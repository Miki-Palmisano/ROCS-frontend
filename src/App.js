import './App.css';
import Home from './pages/home';
import Content from './pages/content';
import { Routes, Route } from "react-router-dom";
import Info from './pages/info';
import Header from './components/header';
import Footer from './components/footer';
import Account from './pages/account';

export default function App() {  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/films/*" element={<Content />} />
        <Route path="/series/*" element={<Content />} />
        <Route path="/account/*" element={<Account />} />
        <Route path="/info/:type" element={<Info />} />
      </Routes>
      <Footer />
    </>
  );
}