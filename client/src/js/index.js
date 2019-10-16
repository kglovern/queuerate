import React from "react";
import ReactDOM from "react-dom";
import "../css/index.css";
import { Provider } from "react-redux";
import store from "../store";
import App from "./Components/App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
