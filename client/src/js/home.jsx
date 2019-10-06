import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
	render() {
		return (
			<div>
				<h2>Home screen</h2>
				<Link to="login">To login</Link>
			</div>
		)
	}
}

export default Home;    