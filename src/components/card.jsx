import '../styles/card.css'
import { useState } from 'react';

export default function Card({image, index}) {
    const [showInfo, setShowInfo] = useState(false)

    const handleSetShowInfo = () => {
        setShowInfo(!showInfo)
    }

    return (
        <>
            <li onClick={() => handleSetShowInfo()} className="card-container">
                <img src={image} key={index} className="card" alt={index + " Image"} />
                {showInfo && 
                    <div onClick={() => handleSetShowInfo()} className="info-container" >
                        <h2>Titolo {index}</h2>
                        <p>Descrizione</p>
                        <p>Genere</p>
                        <p>Anno</p>
                        <p>Regista</p>
                        <p>Attori</p>
                        <p>Valutazione</p> 
                    </div>
                }
            </li>
            
        </>
    )
}