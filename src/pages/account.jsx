import { useContext, useEffect, useState} from "react";
import axios from "axios";
import '../styles/account.css';
import InfoCard from "../components/infoCard";
import UserContext from "../contexts/userContext";
import { Avatar } from '@mui/material';
import { authorization, listEndpoint } from "../endpoints/userEndpoint";
import { useAuth0 } from "@auth0/auth0-react";

export default function Account() {
    const {logOut, username, id} = useContext(UserContext);
    const [contentType, setContentType] = useState('films');
    const [contentState, setContentState] = useState('Visto');
    const { getAccessTokenSilently } = useAuth0();
    const [list, setList] = useState([]);

    useEffect(() => {
        getList();
    }, []); // eslint-disable-line

    const getList = () => {
        getAccessTokenSilently().then((token) => {
            axios.get(listEndpoint({type: contentType, state: contentState}), authorization(token, id))
            .then((res) => {
                setList(res.data);
            })
            .catch(error => {
                if(error.response.status === 401) logOut();
                else console.error('Errore durante la richiesta GET:', error);
            });
        });
    }

    const stringToColor = (string) => {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
    }

    return (
        <div className="accountPage">
            <div className="profileSettings">
                <div className="profileSection">
                    <Avatar sx={{bgcolor: stringToColor(username)}} className="profileImage">{username.substring(0, 2).toUpperCase()}</Avatar>
                    <div className="profileDetails">
                        <p>Ciao, <strong>{username}</strong></p>
                        <button className="logoutButton" onClick={logOut}>Esci</button>
                    </div>
                </div>
                <div className="profileDivider"/>
                <div className="filterSection">
                        <h2>La tua lista</h2>
                        <p>Tipologia:</p>
                        <div className="contentType">
                            <p onClick={() => setContentType('films')} className={contentType === 'films' ? 'active' : ''}>Film</p>
                            <p onClick={() => setContentType('series')} className={contentType === 'series' ? 'active' : ''}>Serie</p>
                        </div>
                        <p>Stato:</p>
                        <div className="contentState">
                            <p onClick={() => setContentState('Visto')} className={contentState === 'Visto' ? 'active' : ''}>Visti</p>
                            <p onClick={() => setContentState('Da Vedere')} className={contentState === 'Da Vedere' ? 'active' : ''}>Da Vedere</p>
                            <p onClick={() => setContentState('In Visione')} className={contentState === 'In Visione' ? 'active' : ''}>In Visione</p>
                        </div>
                        <button onClick={getList}>Filtra</button>
                    </div>
            </div>
            <div className="listSection">
                {list.length === 0 && <h2 className="emptyList">Non ci sono elementi nella tua lista</h2>}
                {list.map((item) => (
                    <InfoCard key={item.id} content={item}/>
                ))}
            </div>
        </div>
    );
}