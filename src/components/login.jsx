import { TextField, Box, Button, Checkbox, Grid, FormControlLabel } from "@mui/material";
import '../styles/sign.css';

export default function Login({ loginSubmit, toggleRegister, changeFormData, closeAccount}) {
    return (
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
                    <button>Recupera Password</button>
                </Grid>
                <Grid item onClick={toggleRegister}>
                    <button>Non ho un Account</button>
                </Grid>
                </Grid>
            </Box>
        </div>
    )
}