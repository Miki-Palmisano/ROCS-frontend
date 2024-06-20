import Footer from "../components/footer";
import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../components/slider";

export default function Serie() {
    const [series, setSeries] = useState([
        {
            "id": 80,
            "name": "Polizieschi",
            "content": [],
            "loading": true
        },
        {
            "id": 16,
            "name": "Animazione",
            "content": [],
            "loading": true
        },
        {
            "id": 10751,
            "name": "Famiglia",
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
            "id": 9648,
            "name": "Mistero",
            "content": [],
            "loading": true
        }
    ]);

    useEffect(() => {
        series.forEach(serie => {
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/series/genres/${serie.id}`).then((res) => {
                setSeries(prevSerie => prevSerie.map(s => s.id === serie.id ? { ...s, content: res.data, loading: false } : s));
                console.log(series);
            }).catch(error => {
                console.error('Errore durante la richiesta GET:', error);
            });
        });
    }, []); // eslint-disable-line


    return (
        <div>
            <Header />
            {series.map(serie => <Slider elements={serie.content} loading={serie.loading} title={serie.name} />)}
            <Footer />
        </div>
    )
}