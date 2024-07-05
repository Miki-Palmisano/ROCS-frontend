import Logo from '../resources/Logo.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Sign from './sign';
import Cookie from 'js-cookie';

export default function Header() {
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(location.pathname);
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);
    const [showSign, setShowSign] = useState(false);
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState('');
    const [accountOption, setAccountOption] = useState(false);

    useEffect(() => {
        setActivePage(location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSearchValue(new URLSearchParams(location.search).get('search') || '');
    }, [location]); // eslint-disable-line

    const toggleBubble = () => { 
        setBubbleOpen(!bubbleOpen);
        setShowSign(false);
    };

    const handleSearch = () => {
        setSearch(!search);
        if(!search) searchInputRef.current.focus();
    }

    const handleSearchChange = (event) => { 
        setSearchValue(event.target.value);
    };

    const handleShowSign = () => {
        setShowSign(!showSign);
        setBubbleOpen(false);
    }

    const showAcccountOption = () => {
        setAccountOption(!accountOption);
    }

    const logOut = () => {
        Cookie.remove('token');
        Cookie.remove('user');
        window.location.reload();
    }

    useEffect(() => {
        if(Cookie.get('token') !== undefined){
            setLogged(true);
            setUsername(Cookie.get('user'));
        }
        else setLogged(false);
    }, []);

    useEffect(() => {
        if (searchValue !== '') {
            navigate(`${activePage}?search=${searchValue} `);
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
                            <Link to={`/home${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <i className="bi bi-house-fill"/> Home
                            </Link> 
                        </li>
                        <li className={activePage.startsWith('/page/films') ? 'activeDesktopPage' : ''}>
                            <Link to={`/page/films${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <i className="bi bi-film"/> Film
                            </Link>
                        </li>
                        <li className={activePage.startsWith('/page/series') ? 'activeDesktopPage' : ''}>
                            <Link to={`/page/series${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <i className="bi bi-camera-video-fill"/> Serie TV
                            </Link>
                        </li>
                        <li onClick={handleSearch}><i className="bi bi-search" /></li>
                        <li className={`searchBar ${search ? 'active':''}`}><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange} ref={searchInputRef}/></li>
                    </div>
                    {logged ? <div className="iconContainer" onClick={showAcccountOption}> Ciao, {username} </div> : <div className="iconContainer" onClick={handleShowSign}>
                        <i className="bi bi-person" />
                        <p>Account</p>
                    </div> }
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
                        {logged ? <li>Ciao, {username}</li> : <li onClick={handleShowSign}>
                            <i className="bi bi-person" />Account
                        </li> }
                        <li className={`mobileSearchBar ${search ? 'active':''}`}><i className="bi bi-search" onClick={handleSearch}/><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange}/></li>
                    </div>
                </div>
            </div>
            {showSign && !logged ? <Sign /> : null}
            {accountOption ? <div className="accountOption"> 
                <li onClick={logOut}><i className="bi-person-walking"/><p>Esci</p><i className="bi bi-door-open" /></li>
                </div> : null}
        </header>
        
        </> 
    );
}