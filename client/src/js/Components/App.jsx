import React from 'react';
import '../../css/App.css';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import DashBoard from './Dashboard';

import { PrivateRoute, LoginRoute, SignUpRoute } from '../Utility/Routes';

class App extends React.Component {

  render() {
    const { isAuth } = this.props;

    return (
        <Router>
          <Switch>
            <LoginRoute authed={true} path="/login" component={Login} />
            <SignUpRoute authed={true} path="/signup" component={SignUp} />
            <PrivateRoute authed={true} path='/' component={DashBoard} />
          </Switch>
        </Router>
    )
  }
}

const mapStateToProps = state => ({
  isAuth: state.user ? state.user.uuid ? true : false: false
})

export default connect(mapStateToProps)(App);
