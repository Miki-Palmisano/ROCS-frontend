import React, { useContext, useEffect, useState} from "react";
import axios from "axios";
import '../styles/account.css';
import InfoCard from "../components/infoCard";
import UserContext from "../contexts/userContext";
import { Avatar } from '@mui/material';
import {authorization, getProfileImageEndpoint, listEndpoint, setProfileImageEndpoint} from "../endpoints/userEndpoint";
import { useAuth0 } from "@auth0/auth0-react";
import ImageSelector from "../components/contentCoverSelector";
import {FormControl, InputLabel, MenuItem, Select, Switch} from "@mui/material";

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

    const handleChangeType = (event) => {
        setContentType(event.target.value);
    };

    const handleChangeState = (event) => {
        setContentState(event.target.value);
    }

    const handleFavouriteChange = (event) => {
        setContentFavourite(event.target.checked);
    }

    return (
        <div className="accountPage">
            <div className="profileSettings">
                <div className="profileSection">
                    <div className="profileImageContainer">
                        {selection ? <div style={{ '--radius': `${radius}px`, '--scale':`${150/(radius*2)}` }} className="dynamicContainer">
                                <img
                                    src={selectedImage}
                                    alt="Selected Portion"
                                    style={{'--selection-x': `${selection.x}px`, '--selection-y': `${selection.y}px`}}
                                    className="dynamicProfileImage"
                                />
                            </div> :
                            <div
                                className="avatarContainer">
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
                        <div className="contentRow">
                            <FormControl fullWidth variant="outlined" className="custom-Form">
                                <InputLabel sx={{color: '#000', marginLeft: '6px'}}>Tipo</InputLabel>
                                <Select
                                    value={contentType}
                                    onChange={handleChangeType}
                                    label="Tipo"
                                    className="custom-switch"
                                >
                                    <MenuItem value="films">Film</MenuItem>
                                    <MenuItem value="series">Serie</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined" className="custom-Form">
                                <InputLabel sx={{color: '#000', marginLeft: '6px'}}>Stato</InputLabel>
                                <Select
                                    value={contentState}
                                    onChange={handleChangeState}
                                    label="Stato"
                                    className="custom-switch"
                                >
                                    <MenuItem value="Visto">Visto</MenuItem>
                                    <MenuItem value="Da Vedere">Da Vedere</MenuItem>
                                    <MenuItem value="In Visione">Sto Vedendo</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="contentRow">
                            <p>Solo Preferiti:</p>
                            <Switch
                                checked={contentFavourite}
                                onChange={handleFavouriteChange}
                                className="custom-switch"
                            />
                            <button onClick={getList}>Filtra</button>
                        </div>
                    </div> :
                    <ImageSelector selection={selection} setSelection={handleSetSelection}
                                   radius={radius} setRadius={setRadius} list={list}
                                   src={selectedImage} />
                }

            </div>
            <div className="listSection">
                {list.length === 0 && <h2 className="emptyList">Non ci sono elementi nella tua lista</h2>}
                {list.map((item) => (
                    <InfoCard key={item.id} content={item}
                              setSelectedImage={showSelection ? handleSetSelectedImage : null}/>
                ))}
            </div>
        </div>
    );
}