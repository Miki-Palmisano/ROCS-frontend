import React, { useState, useEffect } from 'react';
import UserContext from '../contexts/userContext';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const UserProvider = ({ children }) => {

    const {logout, isAuthenticated} = useAuth0();

    const [isLogged, setIsLogged] = useState(() => {
        const savedStatus = localStorage.getItem('isLogged');
        return savedStatus === 'true'; // Converte la stringa 'true' in booleano
    });

    const [username, setUsername] = useState(() => {
        const savedUsername = localStorage.getItem('username');
        return savedUsername;
    });

    useEffect(() => {
        // Aggiorna localStorage quando lo stato cambia
        localStorage.setItem('isLogged', isLogged ? 'true' : 'false');
        localStorage.setItem('username', username);
    }, [isLogged, username]);

    const logOut = async () => {
        await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/users/logout`, {}, { withCredentials: true });
        setIsLogged(false);
        localStorage.removeItem('username');
        if(isAuthenticated) logout();
    }

    return (
        <UserContext.Provider value={{ isLogged, setIsLogged, username, setUsername, logOut }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;