import '../styles/slider.css';
import rullino from '../resources/rullino.jpg';
import skull from '../resources/skull.png';
import Card from './card';

export default function App({films, loading}) {

  return ( 
    <div className="slider">
        <div className="rullino-container">
            <img src={rullino} alt="rullino fotografico"/>
        </div>
        <nav className="images-container">
            {loading ? 
              Array.from({ length: 20 }, (_, index) => (<Card image={skull} key={index} />)) 
              : films.map((f, index) => ( <Card image={f.img} index={index}/> ))}
        </nav>
        <div className="rullino-container"> 
            <img src={rullino} alt="rullino fotografico"/>
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
