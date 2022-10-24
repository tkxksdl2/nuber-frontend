import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/app";
import reportWebVitals from "./reportWebVitals";
import "./styles/styles.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
