import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://codesandbox.io/s/trusting-architecture-s6hri",
  cache: new InMemoryCache(),
});
