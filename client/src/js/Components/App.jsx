import React from 'react';
import '../../css/App.css';
import 'react-toastify/dist/ReactToastify.css';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import DashBoard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import { get_uuid } from "../Utility/Firebase"

import { PrivateRoute, LoginRoute, SignUpRoute, ForgotPasswordRoute } from '../Utility/Routes';
import { toast } from "react-toastify";

class App extends React.Component {

  constructor(props) {
    super(props)
    toast.configure()
  }

  render() {
    const isAuth = get_uuid() ? true : false
    return (
        <Router>
          <Switch>
            <ForgotPasswordRoute authed={isAuth} path="/forgotpassword" component={ForgotPassword} />
            <LoginRoute authed={isAuth} path="/login" component={Login} />
            <SignUpRoute authed={isAuth} path="/signup" component={SignUp} />
            <PrivateRoute authed={isAuth} path='/' component={DashBoard} />
          </Switch>
        </Router>
    )
  }
}

export default connect()(App);
