import '../styles/card.css'
import {Link} from 'react-router-dom';
import rullino from '../assets/rullino.png';

export default function Card({content, index}) {
    return (
        <div className="cards">
            <img src={rullino} alt={index} className="rullino"/>
            <Link to={`/info/${content.type}?id=${content.id}`}>
                <li>
                    <img src={content.img} key={index} className="card" alt={index + " Image"} />
                </li>
            </Link>
            <img src={rullino} alt={index} className="rullino"/>
        </div>
    )
}