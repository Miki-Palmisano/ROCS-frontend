import '../styles/infoCard.css';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/userContext';
import { Favorite, PlaylistAdd, PlaylistAddCheck } from '@mui/icons-material';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

export default function InfoCard({content}) {
    const {isLogged, logOut} = useContext(UserContext);
    const [favorite, setFavorite] = useState(false);
    const [inList, setInList] = useState(false);
    const [addList, setAddList] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        if(isLogged) {
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/users/favorite/state?itemId=${content.id}&type=${content.type}`, 
            { 
                withCredentials: true 
            }).then((res) => {
                if(res.status === 200) setFavorite(true);
            }).catch(error => {
                if(error.response.status === 401) logOut();
                else if(error.response.status !== 404) console.error('Errore durante la richiesta GET:', error);
            });

            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/users/list/state?itemId=${content.id}&type=${content.type}`,
            { 
                withCredentials: true 
            }).then((res) => {
                if(res.status === 200) {
                    setList({state: res.data.status, vote: res.data.vote});
                    setInList(true);
                }
            }).catch(error => {
                if(error.response.status === 401) logOut();
                else if(error.response.status !== 404) console.error('Errore durante la richiesta GET:', error);
            });
        }
    }, []); //eslint-disable-line

    const handleAddFavorite = () => {
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/users/favorite`, 
            {
                itemId: content.id,
                type: content.type,
                image: content.img
            }, 
            { 
                withCredentials: true 
            }).then((res) => {
                if(res.status === 200) setFavorite(!favorite);
            }).catch(error => {
                if(error.response.status === 401) logOut();
                else if (error.response.status !== 404) console.error('Errore durante la richiesta POST:', error);
        });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setList((data) => ({...data, [name]: value}));
    }

    const handleAddList = () => {
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/users/list`, 
            {
                itemId: content.id,
                type: content.type,
                image: content.img,
                status: list.state,
                vote: list.vote
            }, 
            { 
                withCredentials: true 
            }).then((res) => {
                setInList(true);
                if(res.status === 200) setAddList(false);
            }).catch(error => {
                if(error.response.status === 401) logOut();
                else console.error('Errore durante la richiesta POST:', error);
        });
    }

    const handleRemoveList = () => {
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/users/list/remove`, 
            {
                itemId: content.id,
                type: content.type
            }, 
            { 
                withCredentials: true 
            }).then((res) => {
                setInList(false);
                if(res.status === 200) setAddList(false);
            }).catch(error => {
                if(error.response.status === 401) logOut();
                else console.error('Errore durante la richiesta POST:', error);
        });
    }

    const toggleAddList = () => {
        setAddList(!addList);
    }

    return (
            <div className="infoCardContainer">
                <Link to={`/info/${content.type}/${content.id}`} className="linkPage">
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
                            <span>{content.type === 'films' ? 'FILM' : 'SERIE TV'} </span>
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