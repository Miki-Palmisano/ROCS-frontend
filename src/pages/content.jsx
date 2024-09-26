import Slider from "../components/slider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import '../styles/content.css';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, Chip, Grid } from '@mui/material';
import { FilterAlt, Close } from '@mui/icons-material';
import qs from 'qs';
import { genreEndpoint, providerEndpoint, queryEndpoint } from "../endpoints/contentEndpoint";

export default function Content() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Recupera selectedGenres dal localStorage o imposta un array vuoto se non esiste
    const [selectedGenres, setSelectedGenres] = useState(() => {
        const savedSelectedGenres = localStorage.getItem('selectedGenres');
        return savedSelectedGenres ? JSON.parse(savedSelectedGenres) : [];
    });

    // Recupera selectedProviders dal localStorage o imposta un array vuoto se non esiste
    const [selectedProviders, setSelectedProviders] = useState(() => {
        const savedSelectedProviders = localStorage.getItem('selectedProviders');
        return savedSelectedProviders ? JSON.parse(savedSelectedProviders) : [];
    });

    const type = useLocation().pathname;
    const [genres, setGenres] = useState([]);
    const [streamingProviders, setStreamingProviders] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get( genreEndpoint(type) ).then((res) => {
            setContents(res.data.map(genre => ({ id: genre.id, name: genre.name, content: [], loading: true })));
            setGenres(res.data);
            setLoading(false);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
        axios.get( providerEndpoint(type) ).then((res) => {
            setStreamingProviders(res.data);
            setLoading(false);
        }).catch(error => {
            console.error('Errore durante la richiesta GET:', error);
        });
    }, [type]); // eslint-disable-line

    // Effetto per salvare selectedGenres nel localStorage quando cambia
    useEffect(() => {
        localStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
    }, [selectedGenres]);

    // Effetto per salvare selectedProviders nel localStorage quando cambia
    useEffect(() => {
        localStorage.setItem('selectedProviders', JSON.stringify(selectedProviders));
    }, [selectedProviders]);

    const handleGenreChange = (event) => {
        setSelectedGenres(event.target.value);
    };

    const handleProviderChange = (event) => {
        setSelectedProviders(event.target.value);
    };

    useEffect(() => {
        if(type !== localStorage.getItem('type')){
            localStorage.setItem('type', type);
            setSelectedGenres([]);
            setSelectedProviders([]);
            localStorage.setItem('selectedGenres', JSON.stringify([]));
            localStorage.setItem('selectedProviders', JSON.stringify([]));
        }
    }, [type]); // eslint-disable-line 

    useEffect(() => {
        genres.forEach(g => {
            const params = {
                providerId: selectedProviders.length > 0 ? selectedProviders.join('|') : null,
                genreId: selectedGenres.length !== 0 ? selectedGenres.join(',') + ',' + g.id : g.id,
            };

            const queryString = qs.stringify(params, { skipNulls: true, addQueryPrefix: true });

            axios.get(queryEndpoint(type, queryString))
                .then((res) => {
                    setContents(content => content.map(c => c.id !== g.id ? c : { ...c, content: res.data.filter(item => item.img !== null), loading: false}));
                })
                .catch(error => {
                    console.error('Errore durante la richiesta GET:', error);
                })
        });
    }, [loading, selectedGenres, selectedProviders, type]); // eslint-disable-line

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
                        className="genre-select"
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
                                {selected.map((id) => {
                                    const provider = streamingProviders.find(p => p.id === id);
                                    return provider ? (
                                        <Chip 
                                            key={id} 
                                            className="customChip" 
                                            label={<img src={provider.logo} className="providerLogo" alt={provider.name + ' logo'}/>} 
                                        />
                                    ) : null;
                                })}
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
                <Close />
            </div>

            {loading ? 
                <Slider elements={null} loading={true} title={'Caricamento...'} />
             : <>
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