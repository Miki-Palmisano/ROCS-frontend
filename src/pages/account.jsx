import { useContext, useEffect, useState} from "react";
import axios from "axios";
import Slider from "../components/slider";
import '../styles/account.css';
import { Link } from "react-router-dom";
import UserContext from "../contexts/userContext";

export default function Account() {
    const {logOut, username} = useContext(UserContext);
    const [loadingList, setLoadingList] = useState(true);
    const [list, setList] = useState([
        {
            id: 'filmList',
            type: 'film',
            list: [],
            name: 'I Tuoi Film'
        },
        {
            id: 'serieList',
            type: 'serie',
            list: [],
            name: 'Le Tue Serie'
        },
        {
            id: 'favoriteList',
            list: [],
            name: 'I tuoi Preferiti'
        }
    ]);

    useEffect(() => {
        list.map(l => axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/users/list?listId=${l.id}`, { 
            withCredentials: true }).then((res) => {
                if(res.data.length !== 0) setLoadingList(false);
                setList(prev => prev.map(item => item.id === l.id ? { ...item, list: res.data } : item));
            }).catch(error => {
                if(error.response.status === 401) logOut();
                else console.error('Errore durante la richiesta GET:', error);
            }
        ));
    }, []); // eslint-disable-line

    return (
        <>
            <div className="accountSettings">
                <h1>Ciao {username}{loadingList ? ', comincia ad aggiungere qualcosa alla tua lista!' : ', queste sono le tue liste!'}</h1>
                <button className="logoutButton" onClick={logOut}>Logout</button>
                {loadingList ? <>
                    <p>Per aggiungere un Film o una Serie TV alla tua lista, cercale nelle sezioni dedicate nel menu, clicca sulla copertina e aggiungile tramite le icone disposte sopra</p>
                    <Link to="/" > <button className="addListButton">Aggiungi</button> </Link>
                </> : null}
            </div>
            {list.filter(l => l.list.length !== 0).map((item, index) => <Slider key={index} elements={item.list} loading={false} title={item.name}/> )}
        </>
    );
}