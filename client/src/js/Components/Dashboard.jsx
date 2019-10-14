import React from 'react';
import { connect } from 'react-redux'
import NavBar from '../Utility/Navbar'

class DashBoard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		// console.log(this.props);
		return (
			<NavBar />
		)
	}
}

const mapStateToProps = (state,/* ownProps */) => {
	return {
		state: state
	}
}

export default connect(
	mapStateToProps
)(DashBoard)
