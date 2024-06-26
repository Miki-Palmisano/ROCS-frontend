import Footer from "../components/footer";
import Header from "../components/header";
import Slider from "../components/slider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Content() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { type, keywords } = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}s/genres`).then((res) => {
            setContents(res.data.map(genre => ({ id: genre.id, name: genre.name, content: [], loading: true })));
            setLoading(false);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
        
    }, [type]); // eslint-disable-line

    useEffect(() => {
        contents.forEach(content => 
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}s/genres/${content.id}${keywords !== undefined ? `/search/${keywords}`:''}`).then((res) => {
                setContents(prevContent => prevContent.map(c => c.id === content.id ? { ...c, content: res.data, loading: false } : c));
            })
        );
    }, [loading, type, keywords]); // eslint-disable-line

    return (
        <div>
            <Header />
            {loading ? <Slider elements={null} loading={true} title={'Caricamento...'} /> : contents.filter(c => c.content.length !== 0).map(c => <Slider elements={c.content} loading={c.loading} title={c.name} />)}
            <Footer />
        </div>
    )
}