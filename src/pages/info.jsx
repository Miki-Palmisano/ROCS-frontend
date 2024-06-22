import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/info.css';

export default function Info() {
    const { type, id } = useParams();
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/info/${id}`).then((res) => {
            setInfo(res.data);
            setLoading(false);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });

    }, [type, id]);

    console.log(info);

    return (
        <>
        <Header />
        { !loading ?
        <div className="info-container">
            <div className="video-background">
                {info.video.key !== null ? <iframe
                    src={`https://www.youtube.com/embed/${info.video.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${info.video.key}`}
                    title={info.title}
                    frameBorder="0"
                    allowFullScreen
                ></iframe> : null}
            </div>
            <div className="infoContent">
                <img src={info.img} alt={info.title} className="infoImage" />
                <div className="infoText"> 
                    <h1>{info.title} - {info.tagline}</h1>
                    <div className="infoAdd">
                        <p><strong>Generi:</strong> {info.genres.map((i, index) => `${i.name}${index < info.genres.length - 1 ? ', ' : ''}`)}</p>
                        <p><strong>Data di uscita: </strong>{info.release_date}</p>
                    </div>
                    <p><strong>Descrizione:</strong> {info.description}</p>
                    <div className="infoAdd">
                        <p><strong>Budget: </strong>{info.budget}$</p>
                        <p><strong>Voto: </strong>{info.rating}/10</p>
                        <p><strong>Case di Produzione:</strong> {info.production_companies.map((i, index) => `${i.name}${index < info.genres.length - 1 ? ', ' : ''}`)}</p>
                    </div>
                </div>
            </div>
        </div>
        : null }
        <Footer />
        </>
    )
}