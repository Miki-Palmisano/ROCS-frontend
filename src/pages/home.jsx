import { useEffect, useState } from "react";
import Header from "../components/header";
import Slider from "../components/slider";


export default function Home() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch('http://localhost:4000/').then((res)=>{
      res.json().then((data)=>{
        setFilms(data);
        setLoading(false);
      })
    }).catch( e => console.log(e));
  }, []);


  return (
    <>
    <Header/>
    <h1 style={{color:'#fff'}}>Film</h1>
    <Slider films={films} loading={loading}/>
    <h1 style={{color:'#fff'}}>Solo perché sei tu</h1>
    <Slider films={films} loading={loading}/>
    </>
  );
}