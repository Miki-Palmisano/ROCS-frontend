import '../styles/card.css'
import {Link} from 'react-router-dom';

export default function Card({content, index}) {
    return (
        <>
            <Link to={`/info/${content.type}/${content.id}`}>
                <li className="card-container">
                    <img src={content.img} key={index} className="card" alt={index + " Image"} />
                </li>
            </Link>
        </>
    )
}