import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./constant";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN); // is null at start of app

export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === "production"
        ? "wss:https://nuber-eats-backend-tkxksdl2.herokuapp.com/graphql"
        : "ws://localhost:4000/graphql",
    connectionParams: {
      "X-JWT": authToken() || "",
    },
  })
);

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://nuber-eats-backend-tkxksdl2.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-JWT": authToken() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        token: {
          read() {
            return authToken();
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: splitLink,
  cache,
});
