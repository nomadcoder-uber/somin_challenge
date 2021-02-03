import { render } from "react-dom";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import "./styles/styles.css";
import { client } from "./apollo";
import { App } from "./components/app";

const rootElement = document.getElementById("root");
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
