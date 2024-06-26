import { useEffect, useState } from "react";
import Slider from "../components/slider";
import Header from "../components/header";
import axios from "axios";
import Footer from "../components/footer";
import { useParams } from "react-router-dom";

export default function Home() {
  const GATEWAY_API = process.env.REACT_APP_API_GATEWAY_URL;
  const [films, setFilms] = useState([]);
  const [loadingFilm, setLoadingFilm] = useState(true);
  const [series, setSeries] = useState([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const { keywords } = useParams();

  useEffect(() => {
    axios.get(`${GATEWAY_API}/content/films${keywords !== undefined ? `/search/${keywords}` : ''}`).then((res)=>{
      setFilms(res.data.filter(film => film.img !== null));
      setLoadingFilm(false);
      console.log(res.data)
    }).catch( e => console.log(e));

    axios.get(`${GATEWAY_API}/content/series${keywords !== undefined ? `/search/${keywords}` : ''}`).then((res)=>{
      setSeries(res.data.filter(serie => serie.img !== null));
      setLoadingSeries(false);
    }).catch( e => console.log(e));

  }, [keywords]);  // eslint-disable-line

  console.log(keywords);

  return (
    <>
    <Header />
    <Slider elements={films} loading={loadingFilm} title="Film"/>
    <Slider elements={series} loading={loadingSeries} title="Serie TV"/>
    <Footer />
    </>
  );
}