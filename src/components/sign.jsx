import axios from 'axios';
import { useState, useEffect } from 'react';
import { TextField, Box, Button, Checkbox, Grid, FormControlLabel } from "@mui/material";
import '../styles/sign.css';
import Cookie from 'js-cookie';

export default function Sign() {
    const [registerOpen, setRegisterOpen] = useState(false);
    const [comparePasswords, setComparePasswords] = useState(true);
    const [accountOpen, setAccountOpen] = useState(true);
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
        setComparePasswords(formData.repeatPassword.length !== 0 ? formData.password === formData.repeatPassword : true);
    }, [formData.password, formData.repeatPassword]);

    const loginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/login`, { 
                email: formData.email, password: formData.password });
            console.log(response);
            if(response.status === 200) {
                closeAccount();
                Cookie.set('user', response.data.username);
                Cookie.set('token', response.data.token);
                window.location.reload();
            }
        } catch (error) {
            console.error('Errore durante la richiesta POST:', error);
        }
    };

    const registerSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/database/user/register`, {
                email: formData.email, username: formData.username, password: formData.password });
            console.log(response);
            if(response.status === 200) closeAccount();
        } catch (error) {
            console.error('Errore durante la richiesta POST:', error);
        }
    }

    const closeAccount = () => {
        setAccountOpen(false);
        setRegisterOpen(false);
    }

    const changeFormData = (event) => {
        const { id, value, checked} = event.target;
        const val = event.target.id === 'remember' ? checked : value;
        setFormData((data) => ({...data, [id]: val}));
    }

    return (
        <>
            {accountOpen ? 
            <div className="signContainer">
                <i className="bi bi-x" onClick={closeAccount} />
                <Box component="form" onSubmit={loginSubmit} noValidate sx={{ mt: 1 }}>
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
                </Box>
            </div> : null}
            {registerOpen ? 
            <div className="signContainer">
                <i className="bi bi-x" onClick={closeAccount} />
                <Box component="form" onSubmit={registerSubmit} sx={{ mt: 1 }}>
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
                    {comparePasswords ? null : <p>* Le password non corrispondono</p>}
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