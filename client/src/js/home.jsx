import React from 'react';
import { Link } from 'react-router-dom';
import { login, logout } from '../store/actions'
import { connect } from 'react-redux'

class Home extends React.Component {
	constructor(props) {
		super(props)
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	login() {
		const { login } = this.props;
		login()
	}

	logout() {
		const { logout } = this.props;
		logout()
	}

	render() {
		const loginStatus = this.props.loginStatus == null ? false : this.props.loginStatus
		return (
			<div>
				<h2>Home screen</h2>
				{/* <Link to="login">To login</Link> */}
				Login Status: {loginStatus ? "Logged in" : "logged out"}
				<br />
				<button onClick={this.login}>Login</button>
				<button onClick={this.logout}>Logout</button>
			</div>
		)
	}
}

const mapStateToProps = (state ,/* ownProps */) => {
	return {
		loginStatus: state ? state.login ? state.login.loginStatus : null : null
	}
}

const mapDispatchToProps = dispatch => ({
	login: () => dispatch(login()),
	logout: () => dispatch(logout()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home)
