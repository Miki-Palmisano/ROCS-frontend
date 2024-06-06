import React, { useState } from 'react';
import '../styles/slider.css';
import rullino from '../resources/rullino.jpg';
import Card from './card';

const image = [
    'https://images-3.rakuten.tv/storage/global-movie/translation/artwork/3bb2d783-d9fb-4022-83da-449147ef90c9.jpeg',
    'https://lumiere-a.akamaihd.net/v1/images/image_9758fdef.jpeg?region=0,0,540,810',
    'https://pad.mymovies.it/filmclub/2023/04/019/locandinapg1.jpg',
    'https://pad.mymovies.it/filmclub/2017/09/127/locandina.jpg',
    'https://www.raiplay.it/cropgd/300x400/dl/img/2024/04/30/1714462669364_1536x2048_logo.jpg',
    'https://www.stateofmind.it/wp-content/uploads/2021/02/Coco-2017-un-esempio-di-Death-Education-Recensione-del-film-Disney-Featured.jpg.webp',
    'https://www.indigofilm.it/wp-content/uploads/2023/10/Comandante_Main-KA-140x200-1-560x800.jpg?v=1696865305',
    'https://www.italyformovies.it/app/img/editor/mceu_91117987711700216977534.jpg?1700216977876',
    'https://www.warnerbros.it/wp-content/uploads/2022/11/Tre-di-Troppo_Poster-Italia.jpg',
    'https://mr.comingsoon.it/imgdb/locandine/big/63166.jpg',
    'https://movieplayer.net-cdn.it/t/images/2023/12/06/succede-anche-nelle-migliori-famiglie-poster_jpg_320x0_crop_q85.jpg',
    'https://foto1.newsauto.it/wp-content/uploads/2023/09/Locandina-film-Granturismo.jpg',
    'https://pad.mymovies.it/filmclub/2022/02/239/locandinapg1.jpg',
    'https://static.posters.cz/image/350/poster/rocky-balboa-film-rocky-i167759.jpg'
  ];

export default function App() {
  const [images, setImages] = useState(image);

  return (
    <div className="slider">
        <div className="rullino-container"> 
            {images.map(() => <img src={rullino} alt="rullino fotografico" /> )}
        </div>
        <nav className="images-container">
            {images.map((image, index) => ( <Card image={image} index={index}/> ))}
        </nav>
        <div className="rullino-container"> 
            {images.map(() => <img src={rullino} alt="rullino fotografico" /> )}
        </div>
    </div>
  );
};

/*
const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(image);

  const handlePrev = () => {
    setCurrentIndex(currentIndex !== 0 ? currentIndex - 1 : currentIndex);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex !== images.length - 8 ? currentIndex + 1 : currentIndex);
  };

return --------
<div className="slider">
        <div className="rullino-container" style={{ transform: `translateX(-${currentIndex * (100/8)}%)` }}> 
            {images.map(() => <img src={rullino} alt="rullino fotografico" /> )}
        </div>
        <button className="prev" onClick={handlePrev}>
        <i className="bi bi-arrow-left" />
        </button>
        <div className="images-container" style={{ transform:`translateX(-${currentIndex * (100/8)}%)` }}>
            {images.map((image, index) => ( <Card image={image} index={index}/> ))}
        </div>
        <button className="next" onClick={handleNext}>
            <i className="bi bi-arrow-right" />
        </button>
        <div className="rullino-container" style={{ transform: `translateX(-${currentIndex * (100/8)}%)` }}> 
            {images.map(() => <img src={rullino} alt="rullino fotografico" /> )}
        </div>
    </div>
    */
