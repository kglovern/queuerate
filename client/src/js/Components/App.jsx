import React from 'react';
import '../../css/App.css';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import DashBoard from './Dashboard';
import { get_uuid } from "../Utility/Firebase"

import { PrivateRoute, LoginRoute, SignUpRoute } from '../Utility/Routes';

class App extends React.Component {

  constructor() { 
    this.isAuth = get_uuid() ? true : false;
  }

  render() {

    return (
        <Router>
          <Switch>
            <LoginRoute authed={isAuth} path="/login" component={Login} />
            <SignUpRoute authed={isAuth} path="/signup" component={SignUp} />
            <PrivateRoute authed={isAuth} path='/' component={DashBoard} />
          </Switch>
        </Router>
    )
  }
}

export default connect()(App);
