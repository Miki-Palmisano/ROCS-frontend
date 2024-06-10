import Logo from '../resources/Logo_Transparent.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link} from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
                    <nav className="menu">
                        <li><Link to="/" className="linkPage">Home</Link> </li>
                        <li><Link to="/film" className="linkPage">Film</Link></li>
                        <li><Link to="/serie" className="linkPage">Serie TV</Link></li>
                        <i className="bi bi-search" />
                    </nav>
                    <div className="iconContainer">
                        <p>Account</p>
                        <i className="bi bi-person" />
                    </div>
                </div>
                <div className="mobileDisplay"> 
                    <button className="menuButton" onClick={() => toggleSidebar()}> 
                        <i className="bi bi-list" /> 
                    </button>
                    <div className={`sidebar ${sidebarOpen ? 'active' : ''}`} > 
                        <li onClick={() => toggleSidebar()} className="closeButton"><i className="bi bi-x" /></li>
                        <li><Link to="/" className="linkPage">Home</Link></li>
                        <li><Link to="/film" className="linkPage">Film</Link></li>
                        <li><Link to="/serie" className="linkPage">Serie TV</Link></li>
                        <li>Account</li>
                        <li className="search"><input /></li>
                    </div>
                    
                </div>
            </div>
        </header>
    );
}