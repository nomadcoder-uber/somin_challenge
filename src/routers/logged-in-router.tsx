import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import React from "react";
import { Podcast } from "../pages/client/podcast";
import { Header } from "../components/header";
import { NotFound } from "../pages/404";
import { useMe } from "../hooks/useMe";

const ClientRoutes = [
  <Route path="/" exact>
    <Podcast />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role && ClientRoutes}
        <Redirect to="/" />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
