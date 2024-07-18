import Cookie from "js-cookie";
import { useEffect, useState} from "react";
import axios from "axios";
import Slider from "../components/slider";
import '../styles/account.css';
import Home from "./home";

export default function Account() {
    const token = Cookie.get('token');
    const username = Cookie.get('user');
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
        if(token === undefined) window.location.href = '/';
    }, [token]);

    useEffect(() => {
        list.map(l => axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/list?listId=${l.id}`, {
            headers: { Authorization: `Bearer ${token}`} }).then((res) => {
                if(res.data.length !== 0) setLoadingList(false);
                setList(prev => prev.map(item => item.id === l.id ? { ...item, list: res.data } : item));
            })
        );
    }, []); // eslint-disable-line

    return (
        <>
            <div className="accountSettings">
                <h1>Ciao {username}{loadingList ? ', comincia ad aggiungere qualcosa alla tua lista!' : ', queste sono le tue liste!'}</h1>
            </div>
            {list.filter(l => l.list.length !== 0).map((item, index) => <Slider key={index} elements={item.list} loading={false} title={item.name}/> )}
            {loadingList ? <Home /> : null}
        </>
    );
}