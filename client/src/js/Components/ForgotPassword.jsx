import React, { useState } from 'react';
import { doPasswordReset } from "../Utility/Firebase"

import CssBaseline from '@material-ui/core/CssBaseline';

import { withRouter } from "react-router-dom";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import logo from './../../assets/logo.png';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState();
    
    const onSubmit = event => {
        event.preventDefault();
        doPasswordReset(email);
        
    }
        return <Container component="main" maxWidth="xs">
        <CssBaseline />

        <div className="paper">
        <img src={logo} alt="logo" style={{height: '10%', width: '50%', marginBottom: '10%'}}/>
        
        <Card>
            <CardContent>
            <Typography component="h1" variant="h5" style={{ textAlign: "center"}}>
                Forgot Your Password
      </Typography>
            <form className="form" onSubmit={onSubmit} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="submit"
                    
                >
                    Reset Password 
        </Button>
                <Grid container>
                    <Grid item>
                        <Link href="/signin" variant="body2">
                            Know your password? Sign In
                        </Link>
                    </Grid>
                </Grid>
            </form>
            </CardContent>
			</Card>
        </div>
    </Container>
    
}
export default withRouter(ForgotPassword);