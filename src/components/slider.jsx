import '../styles/slider.css';
import skull from '../resources/skull.png';
import Card from './card';

export default function App({elements, loading, title}) {

  return (
    <div className="sliderContainer">
      <h2>{title}</h2>
      <div className="slider">
        <div className="imagesContainer">
            {loading ? 
              Array.from({ length: 20 }, (_, index) => (<Card content={{img: skull, type: null, id:0}} key={index} />)) 
              : elements.map((e, index) => ( <Card content={e} key={index} /> ))}
        </div>
      </div>
    </div>
  ); 
};