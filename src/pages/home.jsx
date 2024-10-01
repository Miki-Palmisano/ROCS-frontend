import { useEffect, useState } from "react";
import Slider from "../components/slider";
import axios from "axios";
import { getListEndpoint } from "../endpoints/contentEndpoint";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [films, setFilms] = useState([]);
  const [loadingFilm, setLoadingFilm] = useState(true);
  const [series, setSeries] = useState([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');

    axios.get(getListEndpoint('/films')).then((res)=>{
      setFilms(res.data.filter(film => film.img !== null));
      setLoadingFilm(false);
    }).catch( e => console.log(e));

    axios.get(getListEndpoint('/series')).then((res)=>{
      setSeries(res.data.filter(serie => serie.img !== null));
      setLoadingSeries(false);
    }).catch( e => console.log(e));

  }, []);  // eslint-disable-line

  return (
    <>
    {loadingFilm ? <Slider elements={null} loading={true} title={'Caricamento Film...'} /> : <Slider elements={films} loading={loadingFilm} title="Film"/>}
    {loadingSeries ? <Slider elements={null} loading={true} title={'Caricamento Serie...'} /> : <Slider elements={series} loading={loadingSeries} title="Serie TV"/>}
    </>
  );
}