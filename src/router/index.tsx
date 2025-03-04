import React, { lazy } from "react";
import App from "./../App";
import { Navigate } from "react-router-dom";
const HelloThree = lazy(() => import("./../views/HelloThree"));
const AddAxesHelper = lazy(() => import("./../views/AddAxesHelper"));
const ObjectDisplacement = lazy(() => import("./../views/ObjectDisplacement"));
const Geometrys = lazy(() => import("./../views/Geometrys"));
const DifferentMaterials = lazy(() => import("./../views/DifferentMaterials"));
const AddMaterial = lazy(() => import("./../views/AddMaterial"));
const FogScene = lazy(() => import("./../views/FogScene"));
const LoadGltfModel = lazy(() => import("./../views/LoadGltfModel"));
const RaycastingInteraction = lazy(
  () => import("./../views/RaycastingInteraction")
);
const TweenAnimation = lazy(() => import("./../views/TweenAnimation"));
const UVPropSetting = lazy(() => import("./../views/UVPropSetting"));
const NormalVerctor = lazy(() => import("./../views/NormalVerctor"));
const VertexTransform = lazy(() => import("./../views/VertexTransform"));

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
      {
        label: "Geometrys",
        key: "/Geometrys",
        path: "/Geometrys",
        element: withLoadingComponent(<Geometrys />),
      },
      {
        label: "DifferentMaterials",
        key: "/DifferentMaterials",
        path: "/DifferentMaterials",
        element: withLoadingComponent(<DifferentMaterials />),
      },
      {
        label: "AddMaterial",
        key: "/AddMaterial",
        path: "/AddMaterial",
        element: withLoadingComponent(<AddMaterial />),
      },
      {
        label: "FogScene",
        key: "/FogScene",
        path: "/FogScene",
        element: withLoadingComponent(<FogScene />),
      },
      {
        label: "LoadGltfModel",
        key: "/LoadGltfModel",
        path: "/LoadGltfModel",
        element: withLoadingComponent(<LoadGltfModel />),
      },
      {
        label: "RaycastingInteraction",
        key: "/RaycastingInteraction",
        path: "/RaycastingInteraction",
        element: withLoadingComponent(<RaycastingInteraction />),
      },
      {
        label: "TweenAnimation",
        key: "/TweenAnimation",
        path: "/TweenAnimation",
        element: withLoadingComponent(<TweenAnimation />),
      },
      {
        label: "UVPropSetting",
        key: "/UVPropSetting",
        path: "/UVPropSetting",
        element: withLoadingComponent(<UVPropSetting />),
      },
      {
        label: "NormalVerctor",
        key: "/NormalVerctor",
        path: "/NormalVerctor",
        element: withLoadingComponent(<NormalVerctor />),
      },
      {
        label: "VertexTransform",
        key: "/VertexTransform",
        path: "/VertexTransform",
        element: withLoadingComponent(<VertexTransform />),
      },
    ],
  },
];

export default routes;
