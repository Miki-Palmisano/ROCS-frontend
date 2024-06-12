import { useEffect, useState } from "react";
import Slider from "../components/slider";
import Header from "../components/header";


export default function Home() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch('https://rocs-api.onrender.com/api/film').then((res)=>{
      res.json().then((data)=>{
        setFilms(data);
        setLoading(false);
      })
    }).catch( e => console.log(e));
  }, []);


  return (
    <>
    <Header />
    <Slider films={films} loading={loading} title="Film"/>
    <Slider films={films} loading={loading} title="Solo perché sei tu"/>
    </>
  );
}