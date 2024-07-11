import Logo from '../resources/Logo.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Sign from './sign';
import Cookie from 'js-cookie';
import { Avatar } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
    const { logout, isAuthenticated } = useAuth0();
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
        event.preventDefault();
        setSearchValue(event.target.value);
    };

    const handleShowSign = () => {
        setShowSign(!showSign);
    }

    const showAcccountOption = () => {
        setAccountOption(!accountOption);
        setBubbleOpen(false);
    }

    const closeAll = () => {
        setBubbleOpen(false);
        setShowSign(false);
        setAccountOption(false);
    }

    const logOut = () => {
        Cookie.remove('token');
        Cookie.remove('user');
        if(isAuthenticated) logout({ returnTo: window.location.origin });
        window.location.reload();
    }

    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
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
            const encodedSearchValue = encodeURIComponent(searchValue);
            navigate(`${activePage}?search=${encodedSearchValue} `);
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
                        <li className={location.pathname === '/' ? 'activeDesktopPage' : ''}>
                            <Link to={`/${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <i className="bi bi-house-fill"/> Home
                            </Link> 
                        </li>
                        <li className={location.pathname === '/films' ? 'activeDesktopPage' : ''}>
                            <Link to={`/films${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <i className="bi bi-film"/> Film
                            </Link>
                        </li>
                        <li className={location.pathname === '/series' ? 'activeDesktopPage' : ''}>
                            <Link to={`/series${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <i className="bi bi-camera-video-fill"/> Serie TV
                            </Link>
                        </li>
                        <li onClick={handleSearch}><i className="bi bi-search" /></li>
                        <li className={`searchBar ${search ? 'active':''}`}><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange} ref={searchInputRef}/></li>
                    </div>
                    {logged ? <div className="iconContainer" onClick={showAcccountOption}> <Avatar sx={{bgcolor: stringToColor(username)}}>{username.substring(0, 2).toUpperCase()}</Avatar> </div> : <div className="iconContainer" onClick={handleShowSign}>
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
                    <button className="menuButton"> 
                        {bubbleOpen || accountOption ? <i onClick={closeAll} className="bi bi-x" /> : <i onClick={toggleBubble} className="bi bi-list" />} 
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

                        {logged ? <li style={{cursor: 'pointer'}} onClick={showAcccountOption}><Avatar sx={{bgcolor: stringToColor(username), marginRight: '5px', marginLeft: '-5px'}}>{username.substring(0, 2).toUpperCase()}</Avatar>Account</li> 
                        : <li onClick={handleShowSign}><i className="bi bi-person" />Account</li> }
                        <li className={`mobileSearchBar ${search ? 'active':''}`}><i className="bi bi-search" onClick={handleSearch}/><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange}/></li>
                    </div>
                </div>
            </div>
            {showSign && !logged ? <Sign closeAccount={handleShowSign}/> : null}
            {accountOption ? 
                <div className="accountOption"> 
                    <p>Ciao, <strong>{username}</strong></p>
                    <li><Link to="/account" className="linkPage"><i className="bi bi-person-fill" />Profilo</Link></li>
                    <li onClick={logOut}><i className="bi-person-walking"/><p>Esci</p><i className="bi bi-door-open" /></li>
                </div> : null}
        </header>
        
        </> 
    );
}