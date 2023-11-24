import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Root from "./pages/Root";
import { Provider } from "react-redux";
import store from "./store/index.js";
import CategoriesPage from "./pages/CategoriesPage";
import SignUpPage from "./pages/SignUpPage";
import Quiz from "./pages/Quiz";
import ResultPage from "./pages/ResultPage";
import { action as logoutAction } from "./pages/Logout";
import { checkAuth } from "./util/auth";

const httpLink = new HttpLink({
  uri: `http://${import.meta.env.VITE_BACKEND_URL}`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${import.meta.env.VITE_BACKEND_URL}`,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  dataIdFromObject: (o) => o.id,
  credentials: "include",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
        loader: checkAuth,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "quiz",
        element: <Quiz />,
        loader: checkAuth,
      },
      {
        path: "result",
        element: <ResultPage />,
        loader: checkAuth,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
