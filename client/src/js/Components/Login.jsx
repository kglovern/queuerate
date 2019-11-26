import React from 'react';
import { login } from "../Utility/Firebase"
import { withRouter } from "react-router-dom";

import Card from '@material-ui/core/Card';

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import './Login.css';
import logo from './../../assets/logo.png';
import {toast} from "react-toastify";
import CardContent from '@material-ui/core/CardContent';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		}
	}

	handleLogin = async (event) => {
		event.preventDefault();
		const user_creds = this.state;
		const result = await login(user_creds);
		if (!result) {
			toast.error("Invalid login credentials - please try again!", {
				position: "top-center",
				hideProgressBar: false,
			})
		} else {
			console.log("Logged in")
			window.location.reload()
		}
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
					Sign in
		  </Typography>
		  
				<form className="form" noValidate>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						onChange={this.changeHandler}
						autoFocus
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
						onChange={this.changeHandler}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className="submit"
						onClick={this.handleLogin}
					>
						Sign In
			</Button>

				<Link href="/forgotpassword" variant="body2">
				  Forgot your password?
				</Link>
			  
						<Grid item>
							<Link href="/signup" variant="body2">
								Don't have an account? Sign Up
							</Link>
							</Grid>

				</form>
				</CardContent>
			</Card>
			</div>
		</Container>
	}
}

export default withRouter(Login);
