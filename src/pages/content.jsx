import Footer from "../components/footer";
import Header from "../components/header";
import Slider from "../components/slider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../styles/content.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, Chip, Grid } from '@mui/material';

export default function Content() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { type, keywords } = useParams();
    const [streamingProviders, setStreamingProviders] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/genres`).then((res) => {
            setContents(res.data.map(genre => ({ id: genre.id, name: genre.name, content: [], loading: true })));
            setGenres(res.data);
            setLoading(false);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
    }, [type]); // eslint-disable-line

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}/providers`).then((res) => {
            setStreamingProviders(res.data);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
    }, []); // eslint-disable-line

    const handleGenreChange = (event) => {
        setSelectedGenres(event.target.value);
    };

    const handleProviderChange = (event) => {
        setSelectedProviders(event.target.value);
    };

    useEffect(() => {
        if(keywords !== undefined) {
            setSelectedGenres([]);
            setSelectedProviders([]);
        }
        genres.forEach(g => axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/content/${type}${selectedProviders.length === 0 ? '' : `/providers/${selectedProviders.join('|')}`}/genres/${selectedGenres.length === 0 ? g.id : g.id+','+selectedGenres}${keywords !== undefined ? `/search/${keywords}`:''}`).then((res) => {
            setContents(content => content.map(c => c.id !== g.id ? c : ({ ...c, content: res.data.filter(item => item.img !== null), loading: false})));
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        } ));
    }, [loading, keywords, selectedGenres, selectedProviders]); // eslint-disable-line

    return (
        <div>
            <div className="filterContainer">
                <div className="filter"><i className="bi bi-funnel-fill"/>Filtri</div>
                <FormControl className="rounded-form-control">
                    <InputLabel className="centered-input-label" id="genre-label">Genere</InputLabel>
                    <Select
                    labelId="genre-label"
                    id="genre-select"
                    value={selectedGenres}
                    onChange={handleGenreChange}
                    renderValue={(selected) => (
                        <div>
                            {selected && selected !== '' ? (
                                <Chip key={selected} label={genres.find(g => g.id === selected)?.name || "Tutti i generi"} />
                            ) : (
                                "Tutti i generi"
                            )}
                        </div>
                    )}
                    >
                        <MenuItem value="">Tutti i generi</MenuItem>
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="rounded-form-control">
                    <InputLabel className="centered-input-label" id="provider-label">Providers</InputLabel>
                    <Select
                        labelId="provider-label"
                        id="provider-select"
                        multiple
                        value={selectedProviders}
                        onChange={handleProviderChange}
                        renderValue={(selected) => (
                            <div>
                                {selected.map((id) => (
                                    <Chip key={id} className="customChip" label={<img src={streamingProviders.find(p => p.id === id).logo} className="providerLogo" alt={selectedProviders+' logo'}/> || "Tutti i Provider"} />
                                ))}
                            </div>
                        )}
                    >
                        {streamingProviders.map((provider) => (
                            <MenuItem key={provider.id} value={provider.id}>
                                <Checkbox checked={selectedProviders.includes(provider.id)} />
                                <Grid className="provider">
                                    <img src={provider.logo} alt="Logo"/>
                                    {provider.name}
                                </Grid>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {loading ? (
                <Slider elements={null} loading={true} title={'Caricamento...'} />
            ) : (
                contents.filter(c => c.content.length !== 0).filter(c => c.id !== selectedGenres).map(c => (
                    <Slider key={c.id} elements={c.content} loading={c.loading} title={selectedGenres.length !== 0 ? genres.find(g => g.id === selectedGenres).name + ' / ' + c.name : c.name} />
                ))
            )}
        </div>
    );
}