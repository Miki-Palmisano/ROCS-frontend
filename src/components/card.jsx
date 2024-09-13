import '../styles/card.css'
import {Link} from 'react-router-dom';
import rullino from '../assets/rullino.png';

export default function Card({content, index}) {

    return (
        <div className="cards">
            <img src={rullino} alt={index} className="rullino"/>
            <div className="cardContainer">
                <Link to={`/info/${content.type}/${content.id}`}>
                <img src={content.img} key={index} className="card" alt={index + " Image"} />
                </Link>
                {content.vote || content.status ?
                <div className='additionalInfo'>
                    <p>Voto: {content.vote}</p>
                    <p>Stato: {content.status}</p>
                </div> : null}
            </div>
            <img src={rullino} alt={index} className="rullino"/>
        </div>
    )
}