import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "../components/Header";
import { LogoutPage } from "../pages/logout";
import { PageNotFound } from "../pages/404";
import { Podcasts } from "../pages/client/podcasts";
import { Podcast } from "../pages/client/podcast";

export const LoggedInRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Podcasts />
        </Route>
        <Route path="/logout" exact>
          <LogoutPage />
        </Route>
        <Route path="/podcasts/:id">
          <Podcast />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
};
