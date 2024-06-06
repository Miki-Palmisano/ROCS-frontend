import Logo from '../resources/Logo_Transparent.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link} from 'react-router-dom';

export default function Header() {
return (
    <header>
        <div className="header">
            <Link to="/" className="linkPage">
                <div className="logoContainer">
                    <img src={Logo} alt="logo" />
                    <h1>ROCS</h1> {/* Repertorio Opere Cinematografiche e Serie */}
                </div>
            </Link>
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
    </header>
);
}