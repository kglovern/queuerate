import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import signup from '../../store/actions/';

import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

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
    this.props.signup(this.state);
    event.preventDefault();
  }

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
          [name]: value
        }
    ); 
}

	render() {
		return <Container component="main" maxWidth="xs">
		<CssBaseline />
		<div className="paper">
		  <Avatar className="avatar">
			<LockOutlinedIcon />
		  </Avatar>
		  <Typography component="h1" variant="h5">
			Sign Up
		  </Typography>
		  <form className="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={this.changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
		</div>
	  </Container>
	}
}


const mapDispatchToProps = dispatch => {
  return bindActionCreators(signup, dispatch)
}

// const mapStateToProps = state => {
//   return {
//       user: state.user
//   }
// }

export default connect(
  //mapStateToProps,
  null,
  mapDispatchToProps
)(SignUp)
  