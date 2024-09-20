import React, { useState, useEffect } from 'react';
import UserContext from '../contexts/userContext';
import { useAuth0 } from '@auth0/auth0-react';

const UserProvider = ({ children }) => {

    const {logout, isAuthenticated} = useAuth0();

    const [isLogged, setIsLogged] = useState(() => {
        const savedStatus = localStorage.getItem('isLogged');
        return savedStatus === 'true';
    });

    const [username, setUsername] = useState(() => {
        const savedUsername = localStorage.getItem('username');
        return savedUsername;
    });

    const [id, setId] = useState(() => {
        const savedId = localStorage.getItem('id');
        return savedId;
    });

    useEffect(() => {
        localStorage.setItem('isLogged', isLogged ? 'true' : 'false');
        localStorage.setItem('username', username);
        localStorage.setItem('id', id);
    }, [isLogged, username, id]);

    const logOut = () => {
        setIsLogged(false);
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        if(isAuthenticated) logout();
    }

    return (
        <UserContext.Provider value={{ isLogged, setIsLogged, username, setUsername, logOut, id, setId }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;