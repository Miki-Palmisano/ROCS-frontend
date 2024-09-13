import './App.css';
import Home from './pages/home';
import Content from './pages/content';
import { Routes, Route } from "react-router-dom";
import Info from './pages/info';
import Header from './components/header';
import Footer from './components/footer';
import Account from './pages/account';
import { useContext } from 'react';
import UserContext from './context/userContext';

export default function App() {  

  const {isLogged} = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/films/*" element={<Content />} />
        <Route path="/series/*" element={<Content />} />
        <Route path="/account/*" element={isLogged ? <Account /> : <Home />} />
        <Route path="/info/:type/:id" element={<Info />} />
      </Routes>
      <Footer />
    </>
  );
}