import Logo from '../resources/Logo.png'
import '../styles/header.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Login from './login';
import Register from './register';

export default function Header() {
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(location.pathname);
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);
    const [accountOpen, setAccountOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [comparePasswords, setComparePasswords] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
        remember: false
    });

    useEffect(() => {
        setActivePage(location.pathname.split('/')[2] === 'search' || location.pathname.split('/')[2] === undefined ? '/home' : '/page/'+location.pathname.split('/')[2]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // eslint-disable-line

    const toggleBubble = () => { 
        setBubbleOpen(!bubbleOpen); 
        setAccountOpen(false);
        setRegisterOpen(false);
    };

    const handleSearch = () => {
        setSearch(!search);
        if(!search) searchInputRef.current.focus();
    }

    const toggleAccount = () => { 
        setAccountOpen(!registerOpen); 
        setRegisterOpen(accountOpen);
        setBubbleOpen(false);
    }

    const closeAccount = () => {
        setAccountOpen(false);
        setRegisterOpen(false);
    }

    const handleSearchChange = (event) => { setSearchValue(event.target.value); };

    useEffect(() => {
        if (searchValue !== '') {
            navigate(`${activePage}/search/${searchValue}`);
        } else {
            navigate(activePage);
        }
    }, [searchValue]); // eslint-disable-line

    const handleChangeFormData = (event) => {
        const { id, value, checked} = event.target;
        const val = event.target.id === 'remember' ? checked : value;
        setFormData((data) => ({...data, [id]: val}));
    };

    useEffect(() => {
        setComparePasswords(formData.repeatPassword.length !== 0 ? formData.password === formData.repeatPassword : true);
    }, [formData.password, formData.repeatPassword]);

    const loginSubmit = (event) => {
        event.preventDefault();
        if(comparePasswords) console.log(formData);
    };

    const registerSubmit = (event) => {
        event.preventDefault();
        if(comparePasswords) console.log(formData);
    }

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
                            <Link to={`/home${searchValue.length === 0 ? '' : `/search/${searchValue}`}`} className="linkPage">
                                <i className="bi bi-house-fill"/> Home
                            </Link> 
                        </li>
                        <li className={activePage.startsWith('/page/films') ? 'activeDesktopPage' : ''}>
                            <Link to={`/page/films${searchValue.length === 0 ? '' : `/search/${searchValue}`}`} className="linkPage">
                                <i className="bi bi-film"/> Film
                            </Link>
                        </li>
                        <li className={activePage.startsWith('/page/series') ? 'activeDesktopPage' : ''}>
                            <Link to={`/page/series${searchValue.length === 0 ? '' : `/search/${searchValue}`}`} className="linkPage">
                                <i className="bi bi-camera-video-fill"/> Serie TV
                            </Link>
                        </li>
                        <li onClick={handleSearch}><i className="bi bi-search" /></li>
                        <li className={`searchBar ${search ? 'active':''}`}><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange} ref={searchInputRef}/></li>
                    </div>
                    <div className="iconContainer" onClick={toggleAccount}>
                        <i className="bi bi-person" />
                        <p>Account</p>
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
                        <li onClick={toggleAccount}>
                            <i className="bi bi-person" />Account
                        </li>
                        <li className={`mobileSearchBar ${search ? 'active':''}`}><i className="bi bi-search" onClick={handleSearch}/><input type="search" placeholder="Cerca..." value={searchValue} onChange={handleSearchChange}/></li>
                    </div>
                </div>
            </div>
            {accountOpen ? <Login loginSubmit={loginSubmit} toggleRegister={toggleAccount} changeFormData={handleChangeFormData} closeAccount={closeAccount}/> : null}
            {registerOpen ? <Register registerSubmit={registerSubmit} comparePasswords={comparePasswords} changeFormData={handleChangeFormData} toggleAccount={toggleAccount} closeAccount={closeAccount}/> : null}
        </header>
        
        </> 
    );
}