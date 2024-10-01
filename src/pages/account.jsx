import React, { useContext, useEffect, useState} from "react";
import axios from "axios";
import '../styles/account.css';
import InfoCard from "../components/infoCard";
import UserContext from "../contexts/userContext";
import { Avatar } from '@mui/material';
import {authorization, getProfileImageEndpoint, listEndpoint, setProfileImageEndpoint} from "../endpoints/userEndpoint";
import { useAuth0 } from "@auth0/auth0-react";
import ImageSelector from "../components/contentCoverSelector";

export default function Account() {
    const {logOut, username, id} = useContext(UserContext);
    const [contentType, setContentType] = useState('films');
    const [contentState, setContentState] = useState('Visto');
    const [contentFavourite, setContentFavourite] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const [list, setList] = useState([]);

    const [selection, setSelection] = useState(null);
    const [radius, setRadius] = useState(50);
    const [showSelection, setShowSelection] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSetSelection = (value) => {
        setSelection(value)
    }

    const handleSetSelectedImage = (value) => {
        setSelectedImage(value)
    }

    useEffect(() => {
        getList();
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
    }, []); // eslint-disable-line

    const getList = () => {
        getAccessTokenSilently().then((token) => {
            axios.get(listEndpoint({type: contentType, state: contentState, favourite: contentFavourite}), authorization(token, id))
            .then((res) => {
                setList(res.data);
            })
            .catch(error => {
                if(error.response.status === 401) logOut();
                else console.error('Errore durante la richiesta GET:', error);
            });
        });
    }

    const stringToColor = (string) => {
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

    const handleSetShowSelection = () => {
        if(showSelection)
            getAccessTokenSilently().then((token) => {
                axios.post(setProfileImageEndpoint, {
                    image: selectedImage,
                    selection: selection,
                    radius: radius
                }, authorization(token, id)).then((res) => {
                    console.log(res);
                })
            })
        setShowSelection(!showSelection);
    }



    return (
        <div className="accountPage">
            <div className="profileSettings">
                <div className="profileSection">
                    <div className="profileImageContainer">
                        {selection ? <div
                                style={{
                                position: 'relative',
                                width: `${radius * 2}px`,
                                height: `${radius * 2}px`,
                                overflow: 'hidden',
                                borderRadius: '50%',
                                border: '1px solid black',
                                transform: `scale(${150 / (radius * 2)})`,
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
                            </div> :
                            <div style={{
                                display: 'flex',  // Usa Flexbox per il posizionamento
                                justifyContent: 'center',  // Centra orizzontalmente
                                alignItems: 'center',  // Centra verticalmente
                                width: '150px',  // Dimensione fissa
                                height: '150px', // Dimensione fissa
                                borderRadius: '50%', // Bordo circolare per l'Avatar
                                overflow: 'hidden',  // Clip contenuto extra
                                border: '1px solid black' // Stesso stile del cerchio
                            }}>
                                <Avatar
                                    sx={{
                                        bgcolor: stringToColor(username),
                                        width: '100%',  // Avatar occupa tutta la larghezza
                                        height: '100%', // Avatar occupa tutta l'altezza
                                        fontSize: '3rem', // Dimensione del testo per l'Avatar
                                    }}
                                >
                                    {username.substring(0, 2).toUpperCase()}
                                </Avatar>
                            </div>
                        } </div>
                    <div className="profileDetails">
                        <p>Ciao, <strong>{username}</strong></p>
                        <div className="buttonDiv">
                            <button className="logoutButton" onClick={handleSetShowSelection}>
                                {showSelection ? 'Salva' : 'Modifica'}
                            </button>
                            <button className="logoutButton" onClick={logOut}>Esci</button>
                        </div>
                    </div>
                </div>
                <div className="profileDivider"/>
                {!showSelection ?
                    <div className="filterSection">
                        <h2>La tua lista</h2>
                        <p>Tipologia:</p>
                        <div className="contentType">
                            <p onClick={() => setContentType('films')}
                           className={contentType === 'films' ? 'active' : ''}>Film</p>
                        <p onClick={() => setContentType('series')}
                           className={contentType === 'series' ? 'active' : ''}>Serie</p>
                    </div>
                    <p>Stato:</p>
                    <div className="contentState">
                        <p onClick={() => setContentState('Visto')}
                           className={contentState === 'Visto' ? 'active' : ''}>Visti</p>
                        <p onClick={() => setContentState('Da Vedere')}
                           className={contentState === 'Da Vedere' ? 'active' : ''}>Da Vedere</p>
                        <p onClick={() => setContentState('In Visione')} className={contentState === 'In Visione' ? 'active' : ''}>In Visione</p>
                        </div>
                        <p>Solo Preferiti:</p>
                        <div className="contentState">
                            <p onClick={() => setContentFavourite(true)} className={contentFavourite ? 'active' : ''}>Si</p>
                            <p onClick={() => setContentFavourite(false)} className={!contentFavourite ? 'active' : ''}>No</p>
                        </div>
                        <button onClick={getList}>Filtra</button>
                    </div> :
                    <ImageSelector selection={selection} setSelection={handleSetSelection}
                                     radius={radius} setRadius={setRadius} list={list}
                                    src={selectedImage}/>
                }

            </div>
            <div className="listSection">
                {list.length === 0 && <h2 className="emptyList">Non ci sono elementi nella tua lista</h2>}
                {list.map((item) => (
                    <InfoCard key={item.id} content={item} setSelectedImage={showSelection ? handleSetSelectedImage : null}/>
                ))}
            </div>
        </div>
    );
}