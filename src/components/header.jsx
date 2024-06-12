import Logo from '../resources/Logo_Transparent.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link} from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const [bubbleOpen, setBubbleOpen] = useState(false);

    const toggleBubble = () => {
        setBubbleOpen(!bubbleOpen);
    };

    return (
        <header>
            <div className="header">
                <Link to="/" className="linkPage">
                    <div className="logoContainer">
                        <img src={Logo} alt="logo" />
                        <h1>ROCS</h1> {/* Repertorio Opere Cinematografiche e Serie */}
                    </div>
                </Link>
                <div className="desktopDisplay">
                    <div className="menu">
                        <li><Link to="/" className="linkPage">Home</Link> </li>
                        <li><Link to="/film" className="linkPage">Film</Link></li>
                        <li><Link to="/serie" className="linkPage">Serie TV</Link></li>
                        <i className="bi bi-search" />
                    </div>
                    <div className="iconContainer">
                        <p>Account</p>
                        <i className="bi bi-person" />
                    </div>
                </div>
                <div className="mobileDisplay"> 
                    <button className="menuButton" onClick={() => toggleBubble()}> 
                        {bubbleOpen ? <i className="bi bi-x" /> : <i className="bi bi-list" />} 
                    </button>
                    <div className={`bubbles ${bubbleOpen ? 'active' : 'inactive'}`} >
                        <li><Link to="/" className="linkPage">Home</Link></li>
                        <li><Link to="/film" className="linkPage">Film</Link></li>
                        <li><Link to="/serie" className="linkPage">Serie TV</Link></li>
                        <li><Link className="linkPage">Account</Link></li>
                    </div>
                </div>
            </div>
        </header>
    );
}