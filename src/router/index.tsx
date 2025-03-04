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
const BoundingBoxAndWorldMatrix = lazy(
  () => import("./../views/BoundingBoxAndWorldMatrix")
);

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
        label: "添加轴助手",
        key: "/addAxesHelper",
        path: "/addAxesHelper",
        element: withLoadingComponent(<AddAxesHelper />),
      },
      {
        label: "物体位移",
        key: "/ObjectDisplacement",
        path: "/ObjectDisplacement",
        element: withLoadingComponent(<ObjectDisplacement />),
      },
      {
        label: "几何形状",
        key: "/Geometrys",
        path: "/Geometrys",
        element: withLoadingComponent(<Geometrys />),
      },
      {
        label: "不同颜色渲染",
        key: "/DifferentMaterials",
        path: "/DifferentMaterials",
        element: withLoadingComponent(<DifferentMaterials />),
      },
      {
        label: "纹理颜色空间",
        key: "/AddMaterial",
        path: "/AddMaterial",
        element: withLoadingComponent(<AddMaterial />),
      },
      {
        label: "雾场景",
        key: "/FogScene",
        path: "/FogScene",
        element: withLoadingComponent(<FogScene />),
      },
      {
        label: "加载GLTF模型",
        key: "/LoadGltfModel",
        path: "/LoadGltfModel",
        element: withLoadingComponent(<LoadGltfModel />),
      },
      {
        label: "光线投射3D场景交互",
        key: "/RaycastingInteraction",
        path: "/RaycastingInteraction",
        element: withLoadingComponent(<RaycastingInteraction />),
      },
      {
        label: "补间动画",
        key: "/TweenAnimation",
        path: "/TweenAnimation",
        element: withLoadingComponent(<TweenAnimation />),
      },
      {
        label: "UV坐标添加纹理",
        key: "/UVPropSetting",
        path: "/UVPropSetting",
        element: withLoadingComponent(<UVPropSetting />),
      },
      {
        label: "法线向量与法线辅助",
        key: "/NormalVerctor",
        path: "/NormalVerctor",
        element: withLoadingComponent(<NormalVerctor />),
      },
      {
        label: "变换顶点位置",
        key: "/VertexTransform",
        path: "/VertexTransform",
        element: withLoadingComponent(<VertexTransform />),
      },
      {
        label: "包围盒与世界矩阵",
        key: "/BoundingBoxAndWorldMatrix",
        path: "/BoundingBoxAndWorldMatrix",
        element: withLoadingComponent(<BoundingBoxAndWorldMatrix />),
      },
    ],
  },
];

export default routes;
