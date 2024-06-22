import '../styles/slider.css';
import rullino from '../resources/rullino.png';
import skull from '../resources/skull.png';
import Card from './card';

export default function App({elements, loading, title}) {

  return (
    <div className="sliderContainer">
      <div className="sliderTitle">
        <h2>{title}</h2>
      </div>
      <div className="slider">
        <div className="rullinoContainer"> 
            <img src={rullino} alt="rullino fotografico"/>
        </div>
        <div className="imagesContainer">
            {loading ? 
              Array.from({ length: 20 }, (_, index) => (<Card content={skull} key={index} />)) 
              : elements.map((f, index) => ( <Card content={f} key={index} /> ))}
        </div>
        <div className="rullinoContainer"> 
            <img src={rullino} alt="rullino fotografico"/>
        </div>
      </div>
    </div>
  ); 
};