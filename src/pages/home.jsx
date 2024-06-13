import { useEffect, useState } from "react";
import Slider from "../components/slider";
import Header from "../components/header";
import axios from "axios";


export default function Home() {
  const url = 'https://rocs-api.onrender.com';
  const [films, setFilms] = useState([]);
  const [loadingFilm, setLoadingFilm] = useState(true);
  const [series, setSeries] = useState([]);
  const [loadingSeries, setLoadingSeries] = useState(true);

  
  useEffect(() => {
    axios.get(`${url}/api/film`).then((res)=>{
      setFilms(res.data);
      setLoadingFilm(false);
    }).catch( e => console.log(e));
  }, []);

  useEffect(() => { 
    axios.get(`${url}/api/serie`).then((res)=>{
      setSeries(res.data);
      setLoadingSeries(false);
    }).catch( e => console.log(e));
  }, []);


  return (
    <>
    <Header />
    <Slider elements={films} loading={loadingFilm} title="Film"/>
    <Slider elements={series} loading={loadingSeries} title="Serie TV"/>
    <Slider elements={films} loading={loadingFilm} title="Solo perché sei tu"/>
    </>
  );
}