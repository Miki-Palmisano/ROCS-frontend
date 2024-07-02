import { TextField, Box, Button, Grid } from "@mui/material";
import '../styles/sign.css';

export default function Register({ registerSubmit, comparePasswords, changeFormData, toggleAccount, closeAccount }) {
    return (
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
                <Grid item onClick={toggleAccount}>
                    <button>Ho già un Account</button>
                </Grid>
            </Box>
        </div>
    )
}