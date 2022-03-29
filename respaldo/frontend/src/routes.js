import React from "react";
import { Switch, Router, Route } from "react-router-dom";

import App from "./App";
import Dashboard from "./components/dashboard/";
import Private from "./components/others/Private";
import Login from "./components/auth/login";

import { history } from "./helpers/history";

const Routes = () => {
  return (
    <App>
      <Router history={history}>
        <Switch>
          <Private path="/panel" component={Dashboard} />
          <Route exact path="/" component={Login} />
        </Switch>
      </Router>
    </App>
  );
};

export default Routes;