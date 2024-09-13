import { useEffect, useState } from 'react';
import '../styles/footer.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Footer() {
    const [state, setState] = useState();
    const location = useLocation();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/status`).then((res) => {
            setState(res.status === 200);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
    }, [location]);

    return (
        <>
        <footer className="footer"> 
            <div className="info">
                <p>© 2024 ROCS - All right reserved.</p>
                <p>Catalogo di film e serie tv fornito da <a href="https://www.themoviedb.org">TMDB</a>. Disponibilità su piattaforme streaming fornite da <a href="https://www.justwatch.com/it/serie-tv/the-grand-tour">JustWatch</a>. Trailer provenienti da <a href="https://www.youtube.com">YouTube</a></p>
                <p>Sviluppato da <a href="https://github.com/Miki-Palmisano">Miki Palmisano</a></p>
                <div className="serviceState">
                    {!state ? <p>Server Offline <span className="status-dot offline"/></p> : <>
                        Server: {state ? 'Online ' : 'Offline '}
                        <span className={`status-dot ${state ? 'online' : 'offline'}`} />
                        </>
                    }
                </div>
            </div>
        </footer>
        </>
    )
}