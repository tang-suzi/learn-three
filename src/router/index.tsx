import React, { lazy } from "react";
import App from "./../App";
import { Navigate } from "react-router-dom";
const HelloThree = lazy(() => import("./../views/HelloThree"));
const AddAxesHelper = lazy(() => import("./../views/AddAxesHelper"));
const ObjectDisplacement = lazy(() => import("./../views/ObjectDisplacement"));

const withLoadingComponent = (children: JSX.Element) => (
  <React.Suspense fallback={<div>Loading...</div>}>{children}</React.Suspense>
);

const routes = [
  {
    key: "/",
    path: "/",
    label: "Three.js",
    element: <App />,
    children: [
      {
        label: "helloThree",
        key: "/helloThree",
        path: "/helloThree",
        element: withLoadingComponent(<HelloThree />),
      },
      {
        label: "addAxesHelper",
        key: "/addAxesHelper",
        path: "/addAxesHelper",
        element: withLoadingComponent(<AddAxesHelper />),
      },
      {
        label: "ObjectDisplacement",
        key: "/ObjectDisplacement",
        path: "/ObjectDisplacement",
        element: withLoadingComponent(<ObjectDisplacement />),
      },
    ],
  },
];

export default routes;
