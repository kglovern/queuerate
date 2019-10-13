import React from 'react';
import { connect } from 'react-redux';
import { login } from "../actions";

class Login extends React.Component {
	render() {
		return <h2>Login screen</h2>
	}
}

function mapStateToProps({ auth }) {
	return { auth };
}

export default connect(mapStateToProps, 
	{ login })(Login);   