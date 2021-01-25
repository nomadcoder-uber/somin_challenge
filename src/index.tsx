import { render } from "react-dom";
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import App from "./App";
import { client } from "./apollo";

const rootElement = document.getElementById("root");
render(
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
, rootElement);
