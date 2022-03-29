// General imports
import React from "react";
import ReactDOM from "react-dom";



// Toast
import { ToastContainer } from "react-toastify";

// GraphQL
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

// Routes
import Routes from "./routes";

// CSS imports
import "./assets/main.scss";

const httpLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth");
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  }

  return {
    headers: {
      ...headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const app = (
  <ApolloProvider client={client}>
    <ToastContainer />
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(app, document.getElementById("root"));
