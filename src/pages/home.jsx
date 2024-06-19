import { useEffect, useState } from "react";
import Slider from "../components/slider";
import Header from "../components/header";
import axios from "axios";
import Footer from "../components/footer";

export default function Home() {
  const GATEWAY_API = process.env.REACT_APP_API_GATEWAY_URL;
  const [films, setFilms] = useState([]);
  const [loadingFilm, setLoadingFilm] = useState(true);
  const [series, setSeries] = useState([]);
  const [loadingSeries, setLoadingSeries] = useState(true);

  useEffect(() => {
    axios.get(`${GATEWAY_API}/content/films`).then((res)=>{
      setFilms(res.data);
      setLoadingFilm(false);
    }).catch( e => console.log(e));

    axios.get(`${GATEWAY_API}/content/series`).then((res)=>{
      setSeries(res.data);
      setLoadingSeries(false);
    }).catch( e => console.log(e));
  }, []);  // eslint-disable-line

  return (
    <>
    <Header />
    <Slider elements={films} loading={loadingFilm} title="Film"/>
    <Slider elements={series} loading={loadingSeries} title="Serie TV"/>
    <Footer />
    </>
  );
}