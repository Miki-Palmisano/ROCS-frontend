import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/info.css';
import Slider from "../components/slider";

export default function Info() {
    const { type, id } = useParams();
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [contents, setContents] = useState([]);
    const [trailer, setTrailer] = useState(false);

    const handlePlayTrailer = () => {
        setTrailer(!trailer);
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/info/${id}`).then((res) => {
            setInfo(res.data);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setContents(res.data.genres.map(genre => ({ id: genre.id, name: genre.name, content: [], loading: true })));
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });

    }, [type, id]);

    useEffect(() => {
        contents.forEach(content => {
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/genres/${content.id}`).then((res) => {
                setContents(prevContent => prevContent.map(c => c.id === content.id ? { ...c, content: res.data, loading: false } : c));
            }).catch(error => {
                console.error('Errore durante la richiesta GET:', error);
            });
        });
    }, [info]); // eslint-disable-line

    return (
        <>
        <Header />
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
                <img src={info.img} alt={info.title} className="infoImage" />
                <div className="infoText"> 
                    <h1>{info.title} {info.tagline.length !== 0? ' - '+ info.tagline : null}</h1>
                    <div className="infoAdd">
                        {info.video.key === null ? null : <button onClick={handlePlayTrailer}><i class="bi bi-play-fill"/> {trailer? "Nascondi":"Mostra"} Trailer</button>}
                        <p><strong>Generi:</strong> {info.genres.map((i, index) => `${i.name}${index < info.genres.length - 1 ? ', ' : ''}`)}</p>
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
                        <p><strong>Voto: </strong>{info.rating}/10</p>
                        <p><strong>Case di Produzione:</strong> {info.production_companies.map((i, index) => `${i.name}${index < info.genres.length - 1 ? ', ' : ''}`)}</p>
                    </div>
                    {info.type === 'series' ? <div className="infoAdd"> 
                        {info.creator.length !== 0 ? <p><strong>Creatore:</strong> {info.creator.map(i => i.name)}</p> : null}
                        <p><strong>Numero Stagioni:</strong> {info.seasons}</p>
                        <p><strong>Numero Episodi:</strong> {info.episodes}</p>
                        {info.episodes_duration.length === 0 ? null : <p><strong>Durata Episodio:</strong> {info.episodes_duration.length !== 1 ? info.episodes_duration[0]+'-'+info.episodes_duration[1]+' min' : info.episodes_duration+' min'}</p>}
                    </div> : null}
                    {info.provider !== null ? <div className="infoProvider">
                        {info.provider.buy !== null ? <div><p><strong>Disponibile con Acquisto su:</strong></p> {info.provider.buy.map(i => <img src={`https://image.tmdb.org/t/p/w780${i.logo_path}` } alt={i.name} /> ) }</div> : null}
                        {info.provider.rent !== null ? <div><p><strong>Disponibile con Noleggio su:</strong></p> {info.provider.rent.map(i => <img src={`https://image.tmdb.org/t/p/w780${i.logo_path}`} alt={i.name}/> ) }</div> : null}
                        {info.provider.flatrate !== null ? <div><p><strong>Disponibile con Abbonamento su:</strong></p> {info.provider.flatrate.map(i => <img src={`https://image.tmdb.org/t/p/w780${i.logo_path}`} alt={i.name}/> ) }</div> : null}
                    </div> : null}
                </div>
            </div>
            <h1>Altri film dello stesso genere</h1>
            {contents.map(content => <Slider elements={content.content} loading={content.loading} title={content.name}/>)}
        </div>
        : null }
        <Footer />
        </>
    )
}