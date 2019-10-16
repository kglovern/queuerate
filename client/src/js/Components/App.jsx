import React from 'react';
import '../../css/App.css';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import DashBoard from './Dashboard';
import { Provider } from 'react-redux'
import store from '../../store'
import { PrivateRoute, LoginRoute, SignUpRoute } from '../Utility/Routes';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <LoginRoute authed={false} path="/login" component={Login} />
            <SignUpRoute authed={false} path="/signup" component={SignUp} />
            <PrivateRoute authed={false} path='/' component={DashBoard} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;