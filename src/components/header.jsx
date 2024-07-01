import Logo from '../resources/Logo.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

export default function Header() {
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(location.pathname);
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        setActivePage(location.pathname.split('/')[2] === undefined ? '/home' : '/page/'+location.pathname.split('/')[2]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // eslint-disable-line

    const toggleBubble = () => {
        setBubbleOpen(!bubbleOpen);
    };

    const handleSearch = () => {
        setSearch(!search);
        if(!search) searchInputRef.current.focus();
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
                    <Link to="/home" className="linkPage">
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
                        <li className={activePage.startsWith('/page/films') ? 'activeDesktopPage' : ''}>
                            <Link to="/page/films" className="linkPage">
                                <i className="bi bi-film"/> Film
                            </Link>
                        </li>
                        <li className={activePage.startsWith('/page/series') ? 'activeDesktopPage' : ''}>
                            <Link to="/page/series" className="linkPage">
                                <i className="bi bi-camera-video-fill"/> Serie TV
                            </Link>
                        </li>
                        <li onClick={handleSearch}><i className="bi bi-search" /></li>
                        <li className={`searchBar ${search ? 'active':''}`}><input type="text" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange} ref={searchInputRef}/></li>
                    </div>
                    <div className="iconContainer">
                        <p>Account</p>
                        <i className="bi bi-person" />
                    </div>
                </div>
                <div className="mobileDisplay"> 
                    <Link to="/home" className="linkPage">
                        <div className="logoContainer">
                            <img src={Logo} alt="logo" />
                            <h1>ROCS</h1> {/* Repertorio Opere Cinematografiche e Serie */}
                        </div>
                    </Link>
                    <button className="menuButton" onClick={toggleBubble}> 
                        {bubbleOpen ? <i className="bi bi-x" /> : <i className="bi bi-list" />} 
                    </button>
                    <div className={`bubbles ${bubbleOpen ? 'active' : 'inactive'}`} >
                        <li className={activePage.startsWith('/home') ? 'activeMobilePage' : ''} onClick={toggleBubble}>
                            <Link to="/home" className="linkPage"><i className="bi bi-house-fill"/>Home</Link>
                        </li>
                        <li className={activePage.startsWith('/page/films') ? 'activeMobilePage' : ''} onClick={toggleBubble}>
                            <Link to="/page/films" className="linkPage"><i className="bi bi-film"/>Film</Link>
                        </li>
                        <li className={activePage.startsWith('/page/series') ? 'activeMobilePage' : ''} onClick={toggleBubble}>
                            <Link to="/page/series" className="linkPage"><i className="bi bi-camera-video-fill"/>Serie TV</Link>
                        </li>
                        <li>
                            <Link className="linkPage"><i className="bi bi-person" />Account</Link>
                        </li>
                        <li className={`mobileSearchBar ${search ? 'active':''}`}><i className="bi bi-search" onClick={handleSearch}/><input type="text" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange}/></li>
                    </div>
                </div>
            </div>
        </header>  
        </> 
    );
}