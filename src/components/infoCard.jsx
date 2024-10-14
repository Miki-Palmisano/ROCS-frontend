import '../styles/infoCard.css';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/userContext';
import { Favorite, PlaylistAdd, PlaylistAddCheck } from '@mui/icons-material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { authorization, favouriteEndpoint, stateListEndpoint, favouriteStateEndpoint, listEndpoint, listRemoveEndpoint } from '../endpoints/userEndpoint';

export default function InfoCard({content, setSelectedImage}) {
    const {isLogged, logOut, id} = useContext(UserContext);
    const [favorite, setFavorite] = useState(false);
    const [inList, setInList] = useState(false);
    const [addList, setAddList] = useState(false);
    const [list, setList] = useState([]);

    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if(isLogged)
            getAccessTokenSilently().then((token) => {
                axios.get( favouriteStateEndpoint(content), authorization(token, id)).then((res) => {
                    setFavorite(true);
                }).catch(error => {
                    if(error.response.status === 401) logOut();
                    else if(error.response.status !== 404) console.error('Errore durante la richiesta GET:', error);
                });

                axios.get( stateListEndpoint(content), authorization( token, id ))
                    .then((res) => {
                        setList({state: res.data.status, vote: res.data.vote});
                        setInList(true);
                    })
                    .catch(error => {
                    if(error.response.status === 401) logOut();
                    else if(error.response.status !== 404) console.error('Errore durante la richiesta GET:', error);
                });
            });
    }, []); //eslint-disable-line

    const handleAddFavorite = () => {
        getAccessTokenSilently().then((token) => {
            axios.post( favouriteEndpoint,
                {
                    itemId: content.id,
                    type: content.type,
                    image: content.img
                }, authorization(token, id)).then((res) => {
                    if(res.status === 200) setFavorite(!favorite);
                }).catch(error => {
                    if(error.response.status === 401) logOut();
                    else if (error.response.status !== 404) console.error('Errore durante la richiesta POST:', error);
            });
        });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setList((data) => ({...data, [name]: value}));
    }

    const handleAddList = () => {
        getAccessTokenSilently().then((token) => {
            axios.post( listEndpoint(), 
                {
                    itemId: content.id,
                    type: content.type,
                    image: content.img,
                    status: list.state,
                    description: content.description,
                    year: content.year,
                    title: content.title,
                    vote: list.vote
                }, authorization( token, id )).then((res) => {
                    setInList(true);
                    if(res.status === 200) setAddList(false);
                }).catch(error => {
                    if(error.response.status === 401) logOut();
                    else console.error('Errore durante la richiesta POST:', error);
            });
        });
    }

    const handleRemoveList = () => {
        getAccessTokenSilently().then((token) => {
            axios.post( listRemoveEndpoint,
                {
                    itemId: content.id,
                    type: content.type
                }, authorization( token, id )).then((res) => {
                    setInList(false);
                    if(res.status === 200) setAddList(false);
                }).catch(error => {
                    if(error.response.status === 401) logOut();
                    else console.error('Errore durante la richiesta POST:', error);
            });
        });
    }

    const toggleAddList = () => {
        setAddList(!addList);
    }

    const handleImageClick = (event) => {
        if (setSelectedImage) {
            event.preventDefault();
            setSelectedImage(content.img);
        }
    }

    return (
            <div className="infoCardContainer">
                <Link to={`/info/${content.type}/${content.id}`} className="linkPage" onClick={handleImageClick}>
                    {list.vote && <div className="voteCard">{list.vote}</div>}
                    <img src={content.img} alt={content.title}/>
                </Link>
                <div className="infoCardText">
                    <div className="listContainer">
                        {isLogged && !addList && (<button className={`list ${favorite ? 'active' : ''}`} onClick={handleAddFavorite}><Favorite /></button>)}
                        {addList && ( <div className="addList">
                            <div>
                                <FormControl className="formSelect">
                                    <InputLabel id="stateLabel">Stato</InputLabel>
                                    <Select
                                            labelId="stateLabel"
                                            id="state"
                                            name="state"
                                            value={list.state || ""}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Visto">Visto</MenuItem>
                                            <MenuItem value="Da Vedere">Da Vedere</MenuItem>
                                            <MenuItem value="Sto Vedendo">Sto Vedendo</MenuItem>
                                        </Select>
                                </FormControl>
                                <TextField 
                                        label="Voto"
                                        name="vote"
                                        type="number"
                                        className="formInput"
                                        value={list.vote || ""}
                                        inputProps={{
                                            step: 0.01,
                                            min: 0,
                                            max: 10
                                        }}
                                        onChange={handleChange}
                                />
                            </div>
                            <div className="submitButtons">
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="submit"
                                    variant="contained"
                                    onClick={handleAddList}
                                >
                                    Aggiungi
                                </Button>
                                {inList ? <Button
                                    type="submit"
                                    fullWidth
                                    className="submit"
                                    variant="contained"
                                    onClick={handleRemoveList}
                                >
                                    Rimuovi
                                </Button>: null}
                            </div>
                        </div>)}
                        {!addList && (
                        <div className="infoType">
                            <span>{content.type === 'films' ? 'FILM' : 'SERIE'} </span>
                            <span>{content.year.split('-')[0]}</span>
                        </div>)}
                        {isLogged && (<button className="list" onClick={toggleAddList}>{inList ? <PlaylistAddCheck /> : <PlaylistAdd />}</button>)}
                    </div>
                    {!addList && (
                    <Link to={`/info/${content.type}/${content.id}`} className="linkPage">
                        <h3>{content.title}</h3>
                        <p>{content.description}</p>
                    </Link>)}
                </div>
            </div>
    );
}