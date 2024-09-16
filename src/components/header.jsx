import Logo from '../assets/Logo.png'
import '../styles/header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Sign from './sign';
import { Avatar } from '@mui/material';
import { Home, Movie, Tv, Person, DirectionsWalk, MeetingRoom, Search, Close, Menu } from '@mui/icons-material';
import { useContext } from 'react';
import UserContext from '../context/userContext';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState();
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);
    const [showSign, setShowSign] = useState(false);
    const {isLogged, logOut, username} = useContext(UserContext);
    const [accountOption, setAccountOption] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setActivePage(location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSearchValue(new URLSearchParams(location.search).get('search') || '');
    }, [location.pathname]); // eslint-disable-line

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
        
    }

    const closeAll = () => {
        setShowSign(false);
        setAccountOption(false);
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
        if (searchValue !== '') {
            const encodedSearchValue = encodeURIComponent(searchValue);
            navigate(`${activePage}?search=${encodedSearchValue} `);
        } else {
            navigate(activePage);
        }
    }, [searchValue]); // eslint-disable-line

    const currentPage = () => {
        if (location.pathname.includes('/films')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Movie fontSize="large"/> Film
                </div>
            );
        } else if (location.pathname.includes('/series')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Tv fontSize="large"/> Serie TV
                </div>
            );
        } else if (location.pathname.includes('/account')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Avatar sx={{ bgcolor: stringToColor(username) }}>
                        {username.substring(0, 2).toUpperCase()}
                    </Avatar>
                    Profilo
                </div>
            );
        } else if (location.pathname.includes('/search')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Search fontSize="large"/> Cerca
                </div>
            );
        } else {
            // Default: Logo
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <img src={Logo} alt="logo" />
                    <h1>ROCS</h1>
                </div>
            );
        }
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
                        <li className={location.pathname === '/' ? 'activeDesktopPage' : ''} onClick={closeAll}>
                            <Link to={`/${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <div className="linkLabel"> <Home className="linkIcon"/> Home </div>
                            </Link> 
                        </li>
                        <li className={location.pathname === '/films' ? 'activeDesktopPage' : ''} onClick={closeAll}>
                            <Link to={`/films${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <div className="linkLabel"><Movie className="linkIcon"/> Film</div>
                            </Link>
                        </li>
                        <li className={location.pathname === '/series' ? 'activeDesktopPage' : ''} onClick={closeAll}>
                            <Link to={`/series${searchValue.length === 0 ? '' : `?search=${searchValue}`}`} className="linkPage">
                                <div className="linkLabel"><Tv className="linkIcon"/> Serie TV</div>
                            </Link>
                        </li>
                        <li onClick={handleSearch} className="linkLabel"><Search /></li>
                        <li className={`searchBar ${search ? 'active':''}`}><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange} ref={searchInputRef}/></li>
                    </div>
                    {isLogged ? <div className="iconContainer" onClick={showAcccountOption}> <Avatar sx={{bgcolor: stringToColor(username)}}>{username.substring(0, 2).toUpperCase()}</Avatar> </div> 
                    : <div className="iconContainer" onClick={handleShowSign}>
                        <Person />
                        <p>Account</p>
                    </div> }
                    {accountOption ? 
                        <div className="accountOption">
                        <li>
                            <Link to="/account" className="linkPage">
                                <div className="linkLabel" onClick={showAcccountOption}><Person  /> Profilo </div>
                            </Link>
                        </li>
                        <li onClick={logOut}>
                            <DirectionsWalk className="icon" />
                            <p className="text">Esci</p>
                            <MeetingRoom />
                        </li>
                    </div> : null}
                </div>
                
                    <div className={`mobileDisplay ${isExpanded ? 'expanded' : ''}`}>
                    {!isExpanded && (
                            currentPage()
                    )}

                        {isExpanded && (
                            <>
                                <Link to="/films" className="linkPage">
                                    <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                        <Movie fontSize="large"/> Film
                                    </div>
                                </Link>

                                <Link to="/series" className="linkPage">
                                    <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                        <Tv fontSize="large"/> Serie TV
                                    </div>
                                </Link>

                                <Link to="/" className="linkPage">
                                    <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                        <img src={Logo} alt="logo" />
                                        <h1>ROCS</h1>
                                    </div>
                                </Link>

                                {isLogged ? <Link to="/account" className="linkPage">
                                    <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                        <Avatar sx={{ bgcolor: stringToColor(username) }}>
                                            {username.substring(0, 2).toUpperCase()}
                                        </Avatar>
                                        Profilo
                                    </div>
                                </Link> : <div className="pageContainer" onClick={handleShowSign}>
                                    <Person fontSize="large"/>
                                    Account
                                </div>
                                }

                                <Link to="/search" className="linkPage">
                                    <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                        <Search fontSize="large"/> Cerca
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                    {showSign && !isLogged ? <Sign closeAccount={handleShowSign}/> : null}
            </div>
        </header>
        </> 
    );
}