import React from 'react';
import { signup } from "../Utility/Firebase";

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import logo from './../../assets/logo.png';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './SignUp.css';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
    }
  }
  
  handleSignUp = (event) => {
    signup(this.state);
    event.preventDefault(); 
  }

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    return <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="paper">
      <img src={logo} alt="logo" style={{height: '10%', width: '50%', marginBottom: '10%'}}/>
        
			<Card>
				<CardContent>
					
        <Typography component="h1" variant="h5" style={{ textAlign: "center"}}>
          Sign Up
		  </Typography>
        <form className="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={this.changeHandler}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.changeHandler}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit"
            onClick={this.handleSignUp}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="\login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
        </CardContent>
			</Card>
      </div>
    </Container>
  }
}

export default withRouter(SignUp);
