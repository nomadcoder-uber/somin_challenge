import { gql, useQuery } from "@apollo/client";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import React from "react";
import { meQuery } from "../__generated__/meQuery";
import { Podcast } from "../pages/client/podcast";

const ClientRoutes = [
  <Route path="/" exact>
    <Podcast />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
    }
  }
`;
export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        {data.me.role && ClientRoutes}
        <Redirect from="/potato" to="/" />
      </Switch>
    </Router>
  );
};
