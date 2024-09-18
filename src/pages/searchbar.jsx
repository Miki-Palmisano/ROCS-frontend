import { useState, useEffect} from 'react';
import '../styles/searchbar.css';
import { Search } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import InfoCard from '../components/infoCard';

export default function Searchbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSearchValue(new URLSearchParams(location.search).get('keywords') || null);
    }, [location.pathname]); // eslint-disable-line

    useEffect(() => {
        if (searchValue) {
            setPageCount(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const encodedSearchValue = encodeURIComponent(searchValue);
            navigate(`/search?keywords=${encodedSearchValue} `);
            const queryString = qs.stringify({
                keywords: searchValue,
                page: pageCount,
            }, { skipNulls: true, addQueryPrefix: true });

            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/all/search${queryString}`).then((res) => {
                setSearchResults(res.data.content);
                setTotalPages(res.data.totalPages);
            }).catch(e => console.log(e));
        } else {
            setPageCount(1);
            navigate('/search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const queryString = qs.stringify({
                page: pageCount,
            }, { skipNulls: true, addQueryPrefix: true });

            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/all/popular${queryString}`).then((res) => {
                setSearchResults(res.data.content);
                setTotalPages(res.data.totalPages);
            }).catch(e => console.log(e));
        }
    }, [searchValue]); // eslint-disable-line

    useEffect(() => {
        if (searchValue) {
            const queryString = qs.stringify({
                keywords: searchValue,
                page: pageCount,
            }, { skipNulls: true, addQueryPrefix: true });

            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/all/search${queryString}`).then((res) => {
                setSearchResults([...searchResults, ...res.data.content]);
                setTotalPages(res.data.totalPages);
            }).catch(e => console.log(e));
        } else {
            const queryString = qs.stringify({
                page: pageCount,
            }, { skipNulls: true, addQueryPrefix: true });

            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/all/popular${queryString}`).then((res) => {
                setSearchResults([...searchResults, ...res.data.content]);
                setTotalPages(res.data.totalPages);
            }).catch(e => console.log(e));
        }
    }, [pageCount]); // eslint-disable-line

    const handleSearchChange = (event) => {
        event.preventDefault();
        setSearchValue(event.target.value);
    };

    return (
        <div className="search">
            <div className="backgroundGradient"></div>
            <div className="searchContainer">
                <Search className="searchIcon"/>
                <input type="text" placeholder="Search..." value={searchValue || ''} onChange={handleSearchChange}/>
            </div>
            {searchResults && searchResults.map((result, index) => 
                <InfoCard key={index} content={result} />
                )}
            {pageCount !== totalPages ? <button onClick={() => setPageCount(pageCount + 1)} className="pageButton"><p>+</p></button> : null}
        </div>
    );
}