import Logo from '../resources/Logo.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const location = useLocation();
    const [activePage, setActivePage] = useState(location.pathname);

    useEffect(() => {
        setActivePage(location.pathname);
    }, [location.pathname]);

    const toggleBubble = () => {
        setBubbleOpen(!bubbleOpen);
    };

    return (
        <>
        <div className="backgroundGradient"></div>
        <header>
            <div className="header">
                <div className="desktopDisplay">
                    <Link to="/" className="linkPage">
                        <div className="logoContainer">
                            <img src={Logo} alt="logo" />
                            <h1>ROCS</h1> {/* Repertorio Opere Cinematografiche e Serie */}
                        </div>
                    </Link>
                    <div className="menu">
                        <li className={activePage === '/' ? 'activeDesktopPage' : ''}>
                            <Link to="/" className="linkPage">
                                <i className="bi bi-house-fill"/> Home
                            </Link> 
                        </li>
                        <li className={activePage === '/film' ? 'activeDesktopPage' : ''}>
                            <Link to="/film" className="linkPage">
                                <i className="bi bi-film"/> Film
                            </Link>
                        </li>
                        <li className={activePage === '/serie' ? 'activeDesktopPage' : ''}>
                            <Link to="/serie" className="linkPage">
                                <i className="bi bi-camera-video-fill"/> Serie TV
                            </Link>
                        </li>
                        <li><i className="bi bi-search" />Cerca</li>
                    </div>
                    <div className="iconContainer">
                        <p>Account</p>
                        <i className="bi bi-person" />
                    </div>
                </div>
                <div className="mobileDisplay"> 
                    <Link to="/" className="linkPage">
                        <div className="logoContainer">
                            <img src={Logo} alt="logo" />
                            <h1>ROCS</h1> {/* Repertorio Opere Cinematografiche e Serie */}
                        </div>
                    </Link>
                    <button className="menuButton" onClick={() => toggleBubble()}> 
                        {bubbleOpen ? <i className="bi bi-x" /> : <i className="bi bi-list" />} 
                    </button>
                    <div className={`bubbles ${bubbleOpen ? 'active' : 'inactive'}`} >
                        <li className={activePage === '/' ? 'activeMobilePage' : ''}>
                            <Link to="/" className="linkPage"><i className="bi bi-house-fill"/>Home</Link>
                        </li>
                        <li className={activePage === '/film' ? 'activeMobilePage' : ''}>
                            <Link to="/film" className="linkPage"><i className="bi bi-film"/>Film</Link>
                        </li>
                        <li className={activePage === '/serie' ? 'activeMobilePage' : ''}>
                            <Link to="/serie" className="linkPage"><i className="bi bi-camera-video-fill"/>Serie TV</Link>
                        </li>
                        <li>
                            <Link className="linkPage"><i className="bi bi-person" />Account</Link>
                        </li>
                        <li><i className="bi bi-search"/>Cerca</li>
                    </div>
                </div>
            </div>
        </header>  
        </> 
    );
}