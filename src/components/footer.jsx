import { useEffect, useState } from 'react';
import '../styles/footer.css';
import axios from 'axios';

export default function Footer() {
    const [state, setState] = useState();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/state`).then((res) => {
            setState(res.data);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
    }, []);

    return (
        <>
        <footer className="footer"> 
            <div className="info">
                <p>© 2024 ROCS - All right reserved.</p>
                <p>Catalogo di film e serie tv fornito da TMDB. Disponibilità su piattaforme streaming fornite da JustWatch. Trailer provenienti da YouTube</p>
                <p>Sviluppato da Miki Palmisano</p>
                <div className="serviceState">
                    {!state ? <p>Sito Offline <span className="status-dot offline"/></p> : state.map((s, index) => (
                        <p key={index}>
                        {s.service}: {s.status === 200 ? 'Online ' : 'Offline '}
                        <span className={`status-dot ${s.status === 200 ? 'online' : 'offline'}`} />
                        </p>
                    ))}
                </div>
            </div>
        </footer>
        </>
    )
}