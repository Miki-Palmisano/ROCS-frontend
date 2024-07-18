import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import '../styles/info.css';
import Slider from "../components/slider";
import Cookie from 'js-cookie';
import { Favorite, PlaylistAdd, PlayArrow, PlaylistAddCheck } from "@mui/icons-material";
import { Button, Select, MenuItem, TextField, FormControl, InputLabel } from "@mui/material";

export default function Info() {
    const { type, id } = useParams();
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [contents, setContents] = useState([]);
    const [trailer, setTrailer] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [addList, setAddList] = useState(false);
    const [list, setList] = useState([]);
    const [inList, setInList] = useState(false);
    const [searchResults, setSearchResults] = useState({id: 0, name: 'Risultati per: ', content: [], loading: true});
    const keywords = new URLSearchParams(useLocation().search).get('search');

    const handlePlayTrailer = () => {
        setTrailer(!trailer);
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/favorite?itemId=${id}&type=${type}`, 
        { 
            headers: { Authorization: `Bearer ${Cookie.get('token')}` } 
        }).then((res) => {
            if(res.status === 200) setFavorite(true);
        }).catch(error => {
            if(error.response.status === 401) {
                Cookie.remove('token');
                Cookie.remove('user');
            } else if(error.response.status !== 404) console.error('Errore durante la richiesta GET:', error);
        });
    }, [id, type]); //eslint-disable-line

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/list/state?itemId=${id}&type=${type}`,
            { 
                headers: { Authorization: `Bearer ${Cookie.get('token')}` } 
            }).then((res) => {
                if(res.status === 200) {
                    setList({state: res.data.status, vote: res.data.vote});
                    setInList(true);
                }
            }).catch(error => {
                if(error.response && error.response.status === 401) {
                    Cookie.remove('token');
                    Cookie.remove('user');
                }
                console.error('Errore durante la richiesta GET:', error);
            });
    }, [id, type, inList]); //eslint-disable-line

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/info/${id}`).then((res) => {
            setInfo(res.data);
            setLoading(false);
            setContents(res.data.genres.map(genre => ({ id: genre.id, name: genre.name, content: [], loading: true })));
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [type, id]);

    useEffect(() => {
        contents.forEach(content => {
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}?genreId=${content.id}`).then((res) => {
                setContents(prevContent => prevContent.map(c => c.id === content.id ? { ...c, content: res.data.filter(f => f.img !== null), loading: false } : c));
            }).catch(error => {
                console.error('Errore durante la richiesta GET:', error);
            });
        });
    }, [info]); // eslint-disable-line

    useEffect(() => {
        if(keywords !== null){
            const url = `${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/search?keywords=${keywords}`
            axios.get(url).then((res) => setSearchResults({...searchResults, content: res.data.filter(item => item.img !== null), loading: false}))
        } else setSearchResults({...searchResults, content: [], loading: true})
    }, [keywords]); //eslint-disable-line

    const handleAddFavorite = () => {
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/favorite`, 
            {
                itemId: id,
                type: type,
                image: info.img
            }, 
            { 
                headers: { Authorization: `Bearer ${Cookie.get('token')}` } 
            }).then((res) => {
                if(res.status === 200) setFavorite(!favorite);
            }).catch(error => {
                if(error.response.status === 401) {
                    Cookie.remove('token');
                    Cookie.remove('user');
                }
                console.error('Errore durante la richiesta POST:', error);
        });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setList((data) => ({...data, [name]: value}));
    }

    const toggleAddList = () => {
        setAddList(!addList);
    }

    const handleAddList = () => {
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/list`, 
            {
                itemId: id,
                type: type,
                image: info.img,
                status: list.state,
                vote: list.vote
            }, 
            { 
                headers: { Authorization: `Bearer ${Cookie.get('token')}` } 
            }).then((res) => {
                setInList(true);
                if(res.status === 200) setAddList(false);
            }).catch(error => {
                if(error.response.status === 401) {
                    Cookie.remove('token');
                    Cookie.remove('user');
                }
                console.error('Errore durante la richiesta POST:', error);
        });
    }

    const handleRemoveList = () => {
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/list/remove`, 
            {
                itemId: id,
                type: type
            }, 
            { 
                headers: { Authorization: `Bearer ${Cookie.get('token')}` } 
            }).then((res) => {
                setInList(false);
                if(res.status === 200) setAddList(false);
            }).catch(error => {
                if(error.response.status === 401) {
                    Cookie.remove('token');
                    Cookie.remove('user');
                } 
                console.error('Errore durante la richiesta POST:', error);
        });
    }

    return (
        <>
        { !loading ?
        <div className="infoContainer">
            <div className="videoBackground">
                {info.video.key !== null ? <iframe
                    src={`https://www.youtube.com/embed/${info.video.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${info.video.key}`}
                    title={info.title}
                    frameBorder="0"
                    allowFullScreen
                ></iframe> : null}
                <div className="gradientOverlay"></div>
            </div>
            <div className="infoContent">
                <div className="imageContainer ">
                    <img src={info.img} alt={info.title} className="infoImage" />
                    <div className={`infoBackground ${addList ? 'overlay' : ''}`}></div>
                    {Cookie.get('token') ? 
                    <>
                        <div className="listContainer">
                            <FormControl className={`addList ${addList ? 'show' : 'hide'}`} onSubmit={handleAddList}>
                                <p>{inList ? 'Aggiorna la tua lista' : 'Aggiungi alla tua lista'}</p>
                                <div className="addListContent">
                                    <FormControl className="stateForm">
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
                                        value={list.vote || ""}
                                        inputProps={{
                                            step: 0.01,
                                            min: 0,
                                            max: 10
                                        }}
                                        onChange={handleChange}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className="submitButton"
                                    onClick={handleAddList}
                                >
                                    Aggiungi
                                </Button>
                                {inList ? <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className="submitButton"
                                    onClick={handleRemoveList}
                                >
                                    Rimuovi
                                </Button> : null}
                            </FormControl>
                            <div className="buttons">
                                <button className={`heartButton ${favorite ? 'active' : ''}`} onClick={handleAddFavorite}><Favorite /></button>
                                <button className="plusButton" onClick={toggleAddList}>{inList ? <PlaylistAddCheck /> : <PlaylistAdd />}</button>
                            </div>
                        </div> 
                    </>: null}
                </div>
                <div className="infoText"> 
                    <h1>{info.title} {info.tagline.length !== 0? ' - '+ info.tagline : null}</h1>
                    <div className="infoAdd">
                        {info.video.key === null ? null : <button onClick={handlePlayTrailer} className="trailer"><div className={trailer? 'activeTrailer' : ''}><PlayArrow /></div> {trailer? "Nascondi":"Mostra"} Trailer</button>}
                        <p><strong>Generi:</strong> {info.genres.map((i, index) => <span key={i.id}>{i.name}{index < info.genres.length - 1 ? ', ' : ''}</span>)}</p>
                        <p><strong>Data di uscita: </strong>{info.release_date}</p>
                    </div>
                    {trailer ? 
                        <iframe
                            src={`https://www.youtube.com/embed/${info.video.key}?autoplay=1&mute=${trailer?0:1}&controls=${trailer?1:0}&loop=1&playlist=${info.video.key}`}
                            title={info.title}
                            frameBorder="0"
                            allowFullScreen>
                        </iframe> : null}
                    <p><strong>Descrizione:</strong> {info.description}</p>
                    <div className="infoAdd">
                        <p><strong>Stato:</strong> {info.status}</p>
                        <p><strong>Valutazione Media: </strong>{info.rating.toFixed(1)}/10</p>
                        <p><strong>Case di Produzione:</strong> {info.production_companies.filter(i => i.name !== '').map((i, index) => <span key={i.id}>{i.name}{index < (info.production_companies.length - 1) ? ', ' : ''}</span>)}</p>
                    </div>
                    {info.type === 'series' ? <div className="infoAdd"> 
                        {info.creator.length !== 0 ? <p><strong>Creatore:</strong> {info.creator.map((i, index) => <span key={index}>{i.name}</span>)}</p> : null}
                        <p><strong>Numero Stagioni:</strong> {info.seasons}</p>
                        <p><strong>Numero Episodi:</strong> {info.episodes}</p>
                        {info.episodes_duration.length === 0 ? null : <p><strong>Durata Episodio:</strong> {info.episodes_duration.length !== 1 ? info.episodes_duration[0]+'-'+info.episodes_duration[1]+' min' : info.episodes_duration+' min'}</p>}
                    </div> : null}
                    {info.provider !== null ? <div className="infoProvider">
                        {info.provider.buy !== null ? <div><p><strong>Acquistabile su:</strong></p> {info.provider.buy.map(i => <img src={`https://image.tmdb.org/t/p/w780${i.logo_path}` } key={i.id} alt={i.name} /> ) }</div> : null}
                        {info.provider.rent !== null ? <div><p><strong>Noleggiabile su:</strong></p> {info.provider.rent.map(i => <img src={`https://image.tmdb.org/t/p/w780${i.logo_path}`} key={i.id} alt={i.name}/> ) }</div> : null}
                        {info.provider.flatrate !== null ? <div><p><strong>Incluso su:</strong></p> {info.provider.flatrate.map(i => <img src={`https://image.tmdb.org/t/p/w780${i.logo_path}`} key={i.id} alt={i.name}/> ) }</div> : null}
                    </div> : null}
                </div>
            </div>
            <h1>Altri film dello stesso genere</h1>
            {searchResults.loading ? null : <Slider key={searchResults.id} elements={searchResults.content} loading={searchResults.loading} title={searchResults.name + keywords}/>}
            {contents.map(content => <Slider key={content.id} elements={content.content} loading={content.loading} title={content.name}/>)}
        </div>
        : null }
        </>
    )
}