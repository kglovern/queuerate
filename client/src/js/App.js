import React from 'react';
import '../css/App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './login';
import Home from './home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;