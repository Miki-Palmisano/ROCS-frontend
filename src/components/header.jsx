import Logo from '../assets/Logo.png'
import '../styles/header.css'
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { Home, Movie, Tv, Person, Search} from '@mui/icons-material';
import { useContext } from 'react';
import UserContext from '../contexts/userContext';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import {authorization, authEndpoint, getProfileImageEndpoint} from '../endpoints/userEndpoint';

export default function Header() {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);

    const { loginWithPopup, isAuthenticated, isLoading, getAccessTokenSilently,  user } = useAuth0();
    const { id, setIsLogged, isLogged, setUsername , username, logOut, setId } = useContext(UserContext);

    const [selection, setSelection] = useState(null);
    const [radius, setRadius] = useState(50);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]); // eslint-disable-line

    // Login with Auth0
    const handleLogin = async () => {
        await loginWithPopup();
    }

    useEffect(() => {
        if (!isLoading)
          if (isAuthenticated && !isLogged) {
            getAccessTokenSilently().then((token) => {
                axios.post( authEndpoint,
                    {
                        email: user.email,
                        username: user.nickname,
                        sub: user.sub
                    },
                    authorization(token)
                ).then((response) => {
                    setIsLogged(true);
                    setUsername(response.data.username);
                    setId(response.data.id);
                }).catch((error) => {
                    if(error.response.status === 401) {
                        console.log('Unauthorized');
                        logOut();
                    }else{
                        console.log('Error:', error);
                    }
                });
            });
        }
    }, [isAuthenticated]); // eslint-disable-line

    useEffect(() => {
        if(isLogged)
            getAccessTokenSilently().then((token) => {
                axios.get(getProfileImageEndpoint, authorization(token, id))
                    .then((res) => {
                        console.log(res)
                        setSelection({x: res.data.crop.selection.x, y: res.data.crop.selection.y});
                        setRadius(res.data.crop.radius);
                        setSelectedImage(res.data.img);
                    }).catch(error => {
                    if(error.response.status === 401) logOut();
                    else console.error('Errore durante la richiesta GET:', error);
                })
            })
    }, ); // eslint-disable-line

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

    const currentPage = () => {
        if (location.pathname.includes('/films')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Movie className="icon"/> Film
                </div>
            );
        } else if (location.pathname.includes('/series')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Tv className="icon"/> Serie TV
                </div>
            );
        } else if (location.pathname.includes('/account')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <div className="headerImageContainer">
                        {selectedImage ? <>
                            <div
                                style={{
                                    position: 'relative',
                                    width: `${radius * 2}px`,
                                    height: `${radius * 2}px`,
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    border: '1px solid black',
                                    transform: `scale(${50 / (radius * 2)})`,
                                    transformOrigin: 'top left',
                                }}>
                                <img
                                    src={selectedImage}
                                    alt="Selected Portion"
                                    style={{
                                        position: 'absolute',
                                        left: `-${selection.x - radius}px`, // Centra l'immagine selezionata
                                        top: `-${selection.y - radius}px`,  // Centra l'immagine selezionata
                                        width: 250, // Larghezza originale
                                        height: 375, // Altezza originale
                                    }}
                                />
                            </div>
                        </> : <Avatar
                            sx={{
                                bgcolor: stringToColor(username),
                                width: '100%',
                                height: '100%',
                                fontSize: '2rem'
                            }}>{username.substring(0, 2).toUpperCase()}</Avatar>
                        }
                    </div>
                    Profilo
                </div>
            );
        } else if (location.pathname.includes('/search')) {
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <Search className="icon"/> Cerca
                </div>
            );
        } else {
            // Default: Logo
            return (
                <div className="logoOnly" onClick={() => setIsExpanded(true)}>
                    <img src={Logo} alt="logo"/>
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
                                <img src={Logo} alt="logo"/>
                                <h1>ROCS</h1> {/* Repertorio Opere Cinematografiche e Serie */}
                            </div>
                        </Link>
                        <div className="menu">
                            <li className={!location.pathname.includes('films')
                            && !location.pathname.includes('series')
                            && !location.pathname.includes('search')
                            && !location.pathname.includes('account')
                                ? 'activeDesktopPage' : ''}>
                                <Link to="/" className="linkPage">
                                    <div className="linkLabel"><Home className="linkIcon"/> Home</div>
                                </Link>
                            </li>
                            <li className={location.pathname.includes('films') ? 'activeDesktopPage' : ''}>
                                <Link to="/films" className="linkPage">
                                    <div className="linkLabel"><Movie className="linkIcon"/> Film</div>
                                </Link>
                            </li>
                            <li className={location.pathname.includes('series') ? 'activeDesktopPage' : ''}>
                                <Link to="/series" className="linkPage">
                                    <div className="linkLabel"><Tv className="linkIcon"/> Serie TV</div>
                                </Link>
                        </li>
                        <li className={location.pathname.includes('search') ? 'activeDesktopPage' : ''}>
                            <Link to="/search" className="linkPage">
                                <div className="linkLabel"><Search className="linkIcon"/> Cerca</div>
                            </Link>
                        </li>
                    </div>
                    {isLogged ?
                        <Link to ="/account" className='linkPage'>
                            <div className="iconContainer">
                                <div className="headerImageContainer">
                                {selectedImage ? <>
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: `${radius * 2}px`,
                                            height: `${radius * 2}px`,
                                            overflow: 'hidden',
                                            borderRadius: '50%',
                                            border: '1px solid black',
                                            transform: `scale(${50 / (radius * 2)})`,
                                            transformOrigin: 'top left',
                                        }}>
                                        <img
                                            src={selectedImage}
                                            alt="Selected Portion"
                                            style={{
                                                position: 'absolute',
                                                left: `-${selection.x - radius}px`, // Centra l'immagine selezionata
                                                top: `-${selection.y - radius}px`,  // Centra l'immagine selezionata
                                                width: 250, // Larghezza originale
                                                height: 375, // Altezza originale
                                            }}
                                        />
                                    </div>
                                </> : <Avatar
                                    sx={{
                                    bgcolor: stringToColor(username),
                                    width: '100%',
                                    height: '100%',
                                    fontSize: '2rem'
                                }}>{username.substring(0, 2).toUpperCase()}</Avatar>
                                } </div>
                            </div>
                                    </Link>
                                    : <div className="iconContainer" onClick={handleLogin}>
                                <Person/>
                                <p>Account</p>
                            </div>
                            }
                        </div>

                        <div className={`mobileDisplay ${isExpanded ? 'expanded' : ''}`}>
                            {!isExpanded && (
                                currentPage()
                            )}

                            {isExpanded && (
                                <>
                                    <Link to="/films" className="linkPage">
                                        <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                            <Movie className="icon"/> Film
                                        </div>
                                    </Link>

                                    <Link to="/series" className="linkPage">
                                        <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                            <Tv className="icon"/> Serie TV
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
                                    <div className="headerImageContainer">
                                        {selectedImage ? <>
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: `${radius * 2}px`,
                                                    height: `${radius * 2}px`,
                                                    overflow: 'hidden',
                                                    borderRadius: '50%',
                                                    border: '1px solid black',
                                                    transform: `scale(${50 / (radius * 2)})`,
                                                    transformOrigin: 'top left',
                                                }}>
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected Portion"
                                                    style={{
                                                        position: 'absolute',
                                                        left: `-${selection.x - radius}px`, // Centra l'immagine selezionata
                                                        top: `-${selection.y - radius}px`,  // Centra l'immagine selezionata
                                                        width: 250, // Larghezza originale
                                                        height: 375, // Altezza originale
                                                    }}
                                                />
                                            </div>
                                        </> : <Avatar
                                            sx={{
                                            bgcolor: stringToColor(username),
                                            width: '100%',
                                            height: '100%',
                                            fontSize: '2rem'
                                        }}>{username.substring(0, 2).toUpperCase()}</Avatar>
                                        }
                                    </div>
                                    Profilo
                                </div>
                            </Link> : <div className="pageContainer" onClick={handleLogin}>
                                <Person className="icon"/>
                                Account
                            </div>
                            }

                            <Link to="/search" className="linkPage">
                                <div className="pageContainer" onClick={() => setIsExpanded(false)}>
                                    <Search className="icon"/> Cerca
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
        </> 
    );
}