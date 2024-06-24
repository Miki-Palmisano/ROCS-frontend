import Footer from "../components/footer";
import Header from "../components/header";
import Slider from "../components/slider";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Film() {
    const [films, setFilms] = useState([
        {
            "id": 12,
            "name": "Avventura",
            "content": [],
            "loading": true
        },
        {
            "id": 27,
            "name": "Horror",
            "content": [],
            "loading": true
        },
        {
            "id": 10749,
            "name": "Romantici",
            "content": [],
            "loading": true
        },
        {
            "id": 35,
            "name": "Commedia",
            "content": [],
            "loading": true
        },
        {
            "id": 16,
            "name": "Animazione",
            "content": [],
            "loading": true
        }
    ]);

    useEffect(() => {
        films.forEach(film => {
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/films/genres/${film.id}`).then((res) => {
                setFilms(prevFilms => prevFilms.map(f => f.id === film.id ? { ...f, content: res.data, loading: false } : f));
            }).catch(error => {
                console.error('Errore durante la richiesta GET:', error);
            });
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []); // eslint-disable-line

    return (
        <div>
            <Header />
            {films.map(film => <Slider elements={film.content} loading={film.loading} title={film.name} />)}
            <Footer />
        </div>
    )
}