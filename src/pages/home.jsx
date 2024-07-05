import { useEffect, useState } from "react";
import Slider from "../components/slider";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Home() {
  const GATEWAY_API = process.env.REACT_APP_API_GATEWAY_URL;
  const [films, setFilms] = useState([]);
  const [loadingFilm, setLoadingFilm] = useState(true);
  const [series, setSeries] = useState([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const keywords = new URLSearchParams(useLocation().search).get('search');

  useEffect(() => {
    axios.get(`${GATEWAY_API}/content/films${keywords !== null ? `/search?keywords=${keywords}` : ''}`).then((res)=>{
      setFilms(res.data.filter(film => film.img !== null));
      setLoadingFilm(false);
    }).catch( e => console.log(e));

    axios.get(`${GATEWAY_API}/content/series${keywords !== null ? `/search?keywords=${keywords}` : ''}`).then((res)=>{
      setSeries(res.data.filter(serie => serie.img !== null));
      setLoadingSeries(false);
    }).catch( e => console.log(e));

  }, [keywords]);  // eslint-disable-line

  return (
    <>
    {loadingFilm ? <Slider elements={null} loading={true} title={'Caricamento Film...'} /> : <Slider elements={films} loading={loadingFilm} title="Film"/>}
    {loadingSeries ? <Slider elements={null} loading={true} title={'Caricamento Serie...'} /> : <Slider elements={series} loading={loadingSeries} title="Serie TV"/>}
    </>
  );
}