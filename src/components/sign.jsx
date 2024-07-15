import axios from 'axios';
import { useState, useEffect } from 'react';
import { TextField, Box, Button, Checkbox, Grid, FormControlLabel, Divider } from "@mui/material";
import { Google, GitHub, Facebook, Close } from '@mui/icons-material';
import '../styles/sign.css';
import Cookie from 'js-cookie';
import { useAuth0 } from "@auth0/auth0-react";

export default function Sign({closeAccount}) {
    const { loginWithPopup, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [registerOpen, setRegisterOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(true);
    const [message, setMessage] = useState({id: '', message: ''});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}$begin:math:display$$end:math:display$:";'<>?,.]).{8,}$/;
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
        remember: false
    });

    const toggleSign = () => { 
        setAccountOpen(!accountOpen); 
        setRegisterOpen(accountOpen);
    }

    useEffect(() => {
        if(formData.username.length < 4) setMessage({id: 'username', message: 'Username troppo breve'});
        else if(!emailRegex.test(formData.email)) setMessage({id: 'email', message:'Indirizzo Email non Valido'});
        else if(!passwordRegex.test(formData.password)) setMessage({id: 'password', message: 'La password deve contenere almeno 1 maiuscola, 1 numero, 1 carattere speciale ed essere più lunga di 8 caratteri'})
        else if(formData.repeatPassword.length !== 0 && formData.password !== formData.repeatPassword) setMessage({id: 'Rpassword', message: 'Le due password non corrispondono'})
        else setMessage({id: '', message: ''})
    }, [formData]); // eslint-disable-line

    const setCookie = (response) => {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getHours + 1);
        Cookie.set('user', response.data.username, { expires: expirationDate });
        Cookie.set('token', response.data.token, { expires: expirationDate });
        window.location.reload();
    }

    useEffect(() => {
        if (!isLoading)
          if (isAuthenticated) {
            getAccessTokenSilently().then((token) => {
                axios.post(
                    `${process.env.REACT_APP_API_GATEWAY_URL}/database/user/auth`,
                    {
                        email: user.email,
                        username: user.nickname,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            authorization: `Bearer ${token}`,     
                        },
                    }
                )
                .then((response) => {
                    setCookie(response);
                })
                .catch((error) => {
                    console.log(error);
                });
            });
          }
      }, [isAuthenticated, getAccessTokenSilently]); // eslint-disable-line

    const loginSubmit = async (event) => {
        event.preventDefault();
        if (!formData.email || !formData.password) {
            setMessage('Per favore, compila tutti i campi.');
            return;
        }
        
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/login`, { 
            email: formData.email.toUpperCase(), password: formData.password })
            .then((response) => {
                setCookie(response);
            }).catch((error) => {
                console.error('Errore durante la richiesta POST:', error);
                if(error.response.status === 401) setMessage({id: 'login', message: error.response.data.message});
                else setMessage({id: 'login', message: 'Errore durante il login. Per favore, riprova.'});
            });   
    };

    const registerSubmit = async (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/register`, {
        email: formData.email.toUpperCase(), username: formData.username, password: formData.password }).then((response) => {
            if(response.status === 200) {
                toggleSign();
                setMessage({id: 'accountCreated', message: 'Account creato correttamente, Accedi'})
            }
        }).catch((error) => {
        if(error.response && error.response.status === 409) {
            if(error.response.data.message === 'Email già esistente')
                setMessage({id: 'email', message: error.response.data.message})
            else if (error.response.data.message === 'Username già in uso')
                setMessage({id: 'username', message: error.response.data.message})
            console.error(error);
        }});
    }

    const changeFormData = (event) => {
        const { id, value, checked } = event.target;
        const val = event.target.id === 'remember' ? checked : value;
        setFormData((data) => ({...data, [id]: val}));
    }

    const handleLogin = async (provider) => {
        await loginWithPopup({authorizationParams: {connection: provider}});
    }

    return (
        <>
            {accountOpen ? 
            <div className="signContainer">
                <Close onClick={closeAccount} />
                <Box component="form" onSubmit={loginSubmit} noValidate sx={{ mt: 1 }}>
                    {message.id === 'accountCreated' ? <h2>{message.message}</h2> : null}
                    {message.id === 'login' ? <p>{message.message}</p> : null}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        className="textField"
                        onChange={changeFormData}
                    />
                    {message.id === 'login' ? <p>{message.message}</p> : null}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        className="textField"
                        onChange={changeFormData}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" id="remember" onChange={changeFormData}/>}
                        label="Ricordami"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="submitButton"
                    >
                        Accedi
                    </Button>
                    
                    <Grid container>
                    <Grid item xs>
                        <button className="redirectButton">Recupera Password</button>
                    </Grid>
                    <Grid item onClick={toggleSign}>
                        <button className="redirectButton">Non ho un Account</button>
                    </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }}>or</Divider>
                    <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    startIcon={<Google />}
                    className="loginButton"
                    onClick={() => handleLogin('google-oauth2')}
                    >
                        Accedi con Google
                    </Button>
                    <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    startIcon={<Facebook />}
                    className="loginButton"
                    onClick={() => handleLogin('facebook')}
                    >
                        Accedi con Facebook
                    </Button>
                    <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    startIcon={<GitHub />}
                    className="loginButton"
                    onClick={() => handleLogin('github')}
                    >
                        Accedi con GitHub
                    </Button>
                </Box>
            </div> : null}
            {registerOpen ? 
            <div className="signContainer">
                <Close onClick={closeAccount} />
                <Box component="form" onSubmit={registerSubmit} sx={{ mt: 1 }}>
                    {message.id === 'username' ? <p>{message.message}</p> : null}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        className="textField"
                        onChange={changeFormData}
                    />
                    {message.id === 'email' ? <p>{message.message}</p> : null}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        className="textField"
                        onChange={changeFormData}
                    />
                    {message.id === 'password' ? <p>{message.message}</p> : null}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        className="textField"
                        onChange={changeFormData}
                    />
                    {message.id === 'Rpassword' ? <p>{message.message}</p> : null}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="repeatPassword"
                        label="Conferma Password"
                        type="password"
                        id="repeatPassword"
                        autoComplete="current-password"
                        className="textField"
                        onChange={changeFormData}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="submitButton"
                    >
                        Registrati
                    </Button>
                    <Grid item onClick={toggleSign}>
                        <button className="redirectButton">Ho già un Account</button>
                    </Grid>
                </Box>
            </div> : null}
        </>
    );
}