import Logo from '../resources/Logo.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(location.pathname);
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const { type, keywords } = useParams();

    useEffect(() => {
        setActivePage(location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSearchValue('');
    }, [type]); // eslint-disable-line

    const toggleBubble = () => {
        setBubbleOpen(!bubbleOpen);
    };

    const handleSearch = () => {
        setSearch(!search);
    }

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    useEffect(() => {
        if (searchValue !== '') {
            navigate(`${activePage}/search/${searchValue}`);
        } else {
            navigate(activePage);
        }
    }, [searchValue]); // eslint-disable-line

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
                        <li className={activePage.startsWith('/home') ? 'activeDesktopPage' : ''}>
                            <Link to="/home" className="linkPage">
                                <i className="bi bi-house-fill"/> Home
                            </Link> 
                        </li>
                        <li className={type === 'film' ? 'activeDesktopPage' : ''}>
                            <Link to="/page/film" className="linkPage">
                                <i className="bi bi-film"/> Film
                            </Link>
                        </li>
                        <li className={type === 'serie' ? 'activeDesktopPage' : ''}>
                            <Link to="/page/serie" className="linkPage">
                                <i className="bi bi-camera-video-fill"/> Serie TV
                            </Link>
                        </li>
                        <li onClick={handleSearch}><i className="bi bi-search" /></li>
                        <li className={`searchBar ${search ? 'active':''}`}><input type="text" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange}/></li>
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
                    <div className="iconContainer">
                    
                    <li className={`searchBar ${search ? 'active':''}`}><input type="text" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange}/></li>
                    <li onClick={handleSearch}><i className="bi bi-search" /></li>
                    <button className="menuButton" onClick={() => toggleBubble()}> 
                        {bubbleOpen ? <i className="bi bi-x" /> : <i className="bi bi-list" />} 
                    </button>
                    </div>
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
                    </div>
                </div>
            </div>
        </header>  
        </> 
    );
}