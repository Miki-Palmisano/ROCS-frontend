import '../styles/card.css'
import {Link} from 'react-router-dom';
import rullino from '../assets/rullino.png';

export default function Card({content, index}) {

    return (
        <div className="cards">
            <img src={rullino} alt={index} className="rullino"/>
            <Link to={`/info/${content.type}/${content.id}`} className="linkPage">
                <div className="cardContainer">
                    <img src={content.img} key={index} className="card" alt={index + " Image"} />
                    <div className="additionalInfo">
                        {content.vote ?  <p>Voto: {content.vote}</p> : null}
                        {content.status ?  <p>Stato: {content.status}</p>: null}
                    </div>
                </div>
            </Link>
            <img src={rullino} alt={index} className="rullino"/>
        </div>
    )
}