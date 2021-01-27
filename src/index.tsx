import { ApolloProvider } from "@apollo/client";
import React from "react";
import { render } from "react-dom";
import { client } from "./apollo";

import App from "./App";

const rootElement = document.getElementById("root");
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
