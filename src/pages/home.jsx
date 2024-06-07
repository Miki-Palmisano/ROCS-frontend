import { useEffect, useState } from "react";
import Header from "../components/header";
import Slider from "../components/slider";
import { set } from "mongoose";


export default function Home() {
  const [films, setFilms] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/film').then((res)=>{
      res.json().then((data)=>{
        setFilms(data);
        setLoading(false);
      })
    })
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