import * as React from "react";
import * as ReactDOM from "react-dom";
import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import App from "./app";
import Dice from "./components/dice-roller/dice.tsx";
import "./styles.scss";

const browserHistory = createBrowserHistory();

var mountNode = document.getElementById("app");
ReactDOM.render(
  <Router history={browserHistory}>
    <Switch>
      <Route path="/pnp/dice" render={() => <Dice />)} />
      <Route
        path="/:path"
        render={(props) => <App {...props} name="Ghosts" />}
      />
      <Route path="/" render={(props) => <App {...props} name="Ghosts" />} />
    </Switch>
  </Router>,

  mountNode,
);
