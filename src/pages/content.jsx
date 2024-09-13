import Slider from "../components/slider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/content.css';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, Chip, Grid } from '@mui/material';
import {FilterAlt, Close} from '@mui/icons-material';
import qs from 'qs';

export default function Content() {
    const [contents, setContents] = useState([]);
    const [searchResults, setSearchResults] = useState({id: 0, name: 'Risultati per: ', content: [], loading: true});
    const [loading, setLoading] = useState(true);
    const [streamingProviders, setStreamingProviders] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const navigate = useNavigate();
    const type = useLocation().pathname;
    const keywords = new URLSearchParams(useLocation().search).get('search');

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}${type}/genres`).then((res) => {
            setContents(res.data.map(genre => ({ id: genre.id, name: genre.name, content: [], loading: true })));
            setGenres(res.data);
            setLoading(false);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}${type}/providers`).then((res) => {
            setStreamingProviders(res.data);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
    }, [type]); // eslint-disable-line

    const handleGenreChange = (event) => {
        if(selectedGenres.length === 0) navigate(`${type}`);
        setSelectedGenres(event.target.value);
    };

    const handleProviderChange = (event) => {
        if(selectedProviders.length === 0) navigate(`${type}`);
        setSelectedProviders(event.target.value);
    };

    const handleDeleteFilters = () => {
        setSelectedGenres([]);
        setSelectedProviders([]);
    }

    useEffect(() => {
        handleDeleteFilters();
    }, [type]); // eslint-disable-line

    useEffect(() => {
        
        genres.forEach(g => {
            const params = {
                providerId: selectedProviders.length > 0 ? selectedProviders.join('|') : null,
                genreId: selectedGenres.length !== 0 ? selectedGenres.join(',') + ',' + g.id : g.id,
            };

            const queryString = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });

            const url = `${process.env.REACT_APP_API_GATEWAY_URL}${type}${queryString}`;
            axios.get(url)
                .then((res) => {
                    setContents(content => content.map(c => c.id !== g.id ? c : { ...c, content: res.data.filter(item => item.img !== null), loading: false}));
                })
                .catch(error => {
                    console.error('Errore durante la richiesta GET:', error);
                })
        });
    }, [loading, selectedGenres, selectedProviders]); // eslint-disable-line

    useEffect(() => {
        if(keywords !== null){
            const url = `${process.env.REACT_APP_API_GATEWAY_URL}${type}/search?keywords=${keywords}`
            axios.get(url).then((res) => setSearchResults({...searchResults, content: res.data.filter(item => item.img !== null), loading: false}))
        } else setSearchResults({...searchResults, content: [], loading: true})
    }, [keywords]); //eslint-disable-line

    return (
        <div>
            <div className="filterContainer">
                <div className="filter"><FilterAlt className="filterIcon"/>Filtri</div>
                <FormControl className="rounded-form-control">
                    <InputLabel className="centered-input-label" id="genre-label">Genere</InputLabel>
                    <Select
                        labelId="genre-label"
                        id="genre-select"
                        multiple
                        value={selectedGenres}
                        onChange={handleGenreChange}
                        renderValue={(selected) => (
                            <div>
                                {selected.map((id) => {
                                    const genre = genres.find(genre => genre.id === id);
                                    return <Chip key={id} label={genre ? genre.name : ''} />;
                                })}
                            </div>
                        )}
                    >
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                <Checkbox className="custom-checkbox" checked={selectedGenres.includes(genre.id)} />
                                <Grid >
                                    {genre.name}
                                </Grid>
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
                                    <Chip key={id} className="customChip" label={<img src={streamingProviders.find(p => p.id === id).logo} className="providerLogo" alt={selectedProviders+' logo'}/>} />
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
                <Close onClick={handleDeleteFilters} />
            </div>

            {loading ? 
                <Slider elements={null} loading={true} title={'Caricamento...'} />
             : <>
                {searchResults.loading ? null : <Slider key={searchResults.id} elements={searchResults.content} loading={searchResults.loading} title={searchResults.name + keywords}/>}
                {contents.filter(c => c.content.length !== 0).map(c => (
                    <Slider key={c.id} 
                            elements={c.content} 
                            loading={c.loading} 
                            title={selectedGenres.length !== 0 && !genres.filter(g => selectedGenres.includes(g.id)).map(g => g.name).includes(c.name) ? genres.filter(g => selectedGenres.includes(g.id)).map(g => g.name).join(' / ') + ' / ' + c.name : c.name} />
                ))}
            </>}
        </div>
    );
}