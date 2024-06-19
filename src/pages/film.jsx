import Footer from "../components/footer";
import Header from "../components/header";
import Slider from "../components/slider";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Film() {
    const [films, setfilms] = useState([
        {
            "id": 12,
            "name": "Avventura",
            "content": []
        },
        {
            "id": 27,
            "name": "Horror",
            "content": []
        },
        {
            "id": 10749,
            "name": "Romantici",
            "content": []
        },
        {
            "id": 35,
            "name": "Commedia",
            "content": []
        }
    ]);
    const [loadingFilms, setLoadingFilms] = useState(true);

    useEffect(() => {

        films.map(film => {
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/films/genres/${film.id}`).then((res) => {
                setfilms(films => films.map(f => f.id === film.id ? { ...f, content: res.data } : f));
                setLoadingFilms(false);
            }).catch(error => console.error('Errore durante la richiesta GET:', error));
        });

    }, []);

    console.log(films);

    return (
        <div>
            <Header />
            {films.map(film => <Slider elements={film.content} loading={loadingFilms} title={film.name} />)}
            <Footer />
        </div>
    )
}