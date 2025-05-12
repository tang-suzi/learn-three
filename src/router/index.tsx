import React, { lazy } from "react";
import App from "./../App";
const HelloThree = lazy(() => import("./../views/HelloThree"));
const AddAxesHelper = lazy(() => import("./../views/AddAxesHelper"));
const ObjectDisplacement = lazy(() => import("./../views/ObjectDisplacement"));
const Geometrys = lazy(() => import("./../views/Geometrys"));
const DifferentMaterials = lazy(() => import("./../views/DifferentMaterials"));
const AddMaterial = lazy(() => import("./../views/AddMaterial"));
const FogScene = lazy(() => import("./../views/FogScene"));
const LoadGltfModel = lazy(() => import("./../views/LoadGltfModel"));

const TweenAnimation = lazy(() => import("./../views/TweenAnimation"));
const UVPropSetting = lazy(() => import("./../views/UVPropSetting"));
const NormalVerctor = lazy(() => import("./../views/NormalVerctor"));
const VertexTransform = lazy(() => import("./../views/VertexTransform"));
const BoundingBoxAndWorldMatrix = lazy(
  () => import("./../views/BoundingBoxAndWorldMatrix")
);
const MultipleObjectBoundingBoxes = lazy(
  () => import("./../views/MultipleObjectBoundingBoxes")
);
const WireframeGeometry = lazy(() => import("./../views/WireframeGeometry"));
const CityWireframeGeometry = lazy(
  () => import("./../views/CityWireframeGeometry")
);
const MatcapMaterial = lazy(() => import("./../views/MatcapMaterial"));
const LambertMaterial = lazy(() => import("./../views/LambertMaterial"));
const PhongMaterial = lazy(() => import("./../views/PhongMaterial"));
const StandardMaterial = lazy(() => import("./../views/StandardMaterial"));
const PhysicalMaterial = lazy(() => import("./../views/PhysicalMaterial"));
const IorAndReflectivity = lazy(() => import("../views/IorAndReflectivity"));
const ClearcoatMaterial = lazy(() => import("../views/ClearcoatMaterial"));
const ClothAndFabricMaterial = lazy(
  () => import("../views/ClothAndFabricMaterial")
);
const IridescenceEffect = lazy(() => import("../views/IridescenceEffect"));
const DestroyMatrix = lazy(() => import("../views/DestroyMatrix"));
const SettingControls = lazy(() => import("../views/SettingControls"));
const TextureTransform = lazy(() => import("../views/TextureTransform"));
const KTX2_DDS_TGATexture = lazy(() => import("../views/KTX2_DDS_TGATexture"));
const RendererToneMapping = lazy(() => import("../views/RendererToneMapping"));
const EXR_TIF_PngDynamicRangeImg = lazy(
  () => import("../views/EXR_TIF_PngDynamicRangeImg")
);
const DepthRender = lazy(() => import("../views/DepthRender"));
const MaterialMixin = lazy(() => import("../views/MaterialMixin"));
const RenderIceJuice = lazy(() => import("../views/RenderIceJuice"));
const ClipMaterial = lazy(() => import("../views/ClipMaterial"));
const ClipScene = lazy(() => import("../views/ClipScene"));
const TemplateRender = lazy(() => import("../views/TemplateRender"));
const RenderMetalSection = lazy(() => import("../views/RenderMetalSection"));
const AmbientLightAndDirectionalLight = lazy(
  () => import("../views/AmbientLightAndDirectionalLight")
);
const UseSpotLight = lazy(() => import("../views/UseSpotLight"));
const UsePointLight = lazy(() => import("../views/UsePointLight"));
const TransparentTextureAndShadowSetting = lazy(
  () => import("../views/TransparentTextureAndShadowSetting")
);
const LargeSceneCascadeShadowSettings = lazy(
  () => import("../views/LargeSceneCascadeShadowSettings")
);
const PlaceObjects = lazy(() => import("../views/PlaceObjects"));
const GsapAnimate = lazy(() => import("../views/GsapAnimate"));

const UseAnimation = lazy(() => import("../views/Animation/UseAnimation"));
const CreateKeyframes = lazy(
  () => import("../views/Animation/CreateKeyframes")
);
const NumberKeyframes = lazy(
  () => import("../views/Animation/NumberKeyframes")
);
const AnimationMixer = lazy(() => import("../views/Animation/AnimationMixer"));
const UsePointMaterial = lazy(
  () => import("../views/ParticleEffects/UsePointMaterial")
);
const RandomPoints = lazy(
  () => import("../views/ParticleEffects/RandomPoints")
);
const SimulatingGalaxy = lazy(
  () => import("../views/ParticleEffects/SimulatingGalaxy")
);

const RaycastingInteraction = lazy(
  () =>
    import("./../views/RaycastingAndObjectInteraction/RaycastingInteraction")
);
const RaycastingObjectInteraction = lazy(
  () =>
    import(
      "./../views/RaycastingAndObjectInteraction/RaycastingObjectInteraction"
    )
);
const CreateShaderMaterial = lazy(
  () => import("../views/GLSLLearn/CreateShaderMaterial")
);
const ShaderObjects = lazy(() => import("../views/GLSLLearn/ShaderObjects"));
const MaterialBindCannon = lazy(
  () => import("./../views/PhysicsEngine/MaterialBindCannon")
);
const CubeCollision = lazy(
  () => import("./../views/PhysicsEngine/CubeCollision")
);
const KongmingLantern = lazy(
  () => import("../views/GLSLLearn/KongmingLantern")
);
const SmokeOrWater = lazy(() => import("../views/GLSLLearn/SmokeOrWater"));
const ThreeJSWater = lazy(() => import("../views/GLSLLearn/ThreeJSWater"));
const UseShaderCreateParticles = lazy(
  () => import("../views/GLSLLearn/UseShaderCreateParticles")
);
const GalaxyShader = lazy(() => import("../views/GLSLLearn/GalaxyShader"));
const FireworksShader = lazy(
  () => import("../views/GLSLLearn/FireworksShader")
);
const HitCharacters = lazy(() => import("../views/GLSLLearn/HitCharacters"));
const UseEffectComposer = lazy(() => import("../views/UseEffectComposer"));
const CSS2DRender = lazy(() => import("../views/CSS2DRender"));
const CurvesAndTracks = lazy(() => import("../views/CurvesAndTracks"));
const DeformationAnimation = lazy(
  () => import("../views/DeformationAnimation")
);
const FullScreenScroll = lazy(() => import("./../views/FullScreenScroll"));

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
        label: "基础",
        key: "basic",
        children: [
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
            label: "补间动画",
            key: "/TweenAnimation",
            path: "/TweenAnimation",
            element: withLoadingComponent(<TweenAnimation />),
          },
        ],
      },
      {
        label: "geometry",
        key: "geometry",
        children: [
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
          {
            label: "多个物体包围盒",
            key: "/MultipleObjectBoundingBoxes",
            path: "/MultipleObjectBoundingBoxes",
            element: withLoadingComponent(<MultipleObjectBoundingBoxes />),
          },
          {
            label: "线框几何体",
            key: "/WireframeGeometry",
            path: "/WireframeGeometry",
            element: withLoadingComponent(<WireframeGeometry />),
          },
          {
            label: "城市线框几何体",
            key: "/CityWireframeGeometry",
            path: "/CityWireframeGeometry",
            element: withLoadingComponent(<CityWireframeGeometry />),
          },
        ],
      },
      {
        label: "材质",
        key: "material",
        children: [
          {
            label: "Matcap材质",
            key: "/MatcapMaterial",
            path: "/MatcapMaterial",
            element: withLoadingComponent(<MatcapMaterial />),
          },
          {
            label: "朗伯特材质",
            key: "/LambertMaterial",
            path: "/LambertMaterial",
            element: withLoadingComponent(<LambertMaterial />),
          },
          {
            label: "Phong材质",
            key: "/PhongMaterial",
            path: "/PhongMaterial",
            element: withLoadingComponent(<PhongMaterial />),
          },
          {
            label: "标准材质",
            key: "/StandardMaterial",
            path: "/StandardMaterial",
            element: withLoadingComponent(<StandardMaterial />),
          },
          {
            label: "物理材质",
            key: "/PhysicalMaterial",
            path: "/PhysicalMaterial",
            element: withLoadingComponent(<PhysicalMaterial />),
          },
          {
            label: "折射率和反射率",
            key: "/IorAndReflectivity",
            path: "/IorAndReflectivity",
            element: withLoadingComponent(<IorAndReflectivity />),
          },
          {
            label: "清漆材质",
            key: "/ClearcoatMaterial",
            path: "/ClearcoatMaterial",
            element: withLoadingComponent(<ClearcoatMaterial />),
          },
          {
            label: "布料和织物材料",
            key: "/ClothAndFabricMaterial",
            path: "/ClothAndFabricMaterial",
            element: withLoadingComponent(<ClothAndFabricMaterial />),
          },
          {
            label: "虹彩效应",
            key: "/IridescenceEffect",
            path: "/IridescenceEffect",
            element: withLoadingComponent(<IridescenceEffect />),
          },
          {
            label: "销毁模型",
            key: "/DestroyMatrix",
            path: "/DestroyMatrix",
            element: withLoadingComponent(<DestroyMatrix />),
          },
          {
            label: "设置控制器",
            key: "/SettingControls",
            path: "/SettingControls",
            element: withLoadingComponent(<SettingControls />),
          },
        ],
      },
      {
        label: "纹理材质",
        key: "textureMaterial",
        children: [
          {
            label: "纹理变换",
            key: "/TextureTransform",
            path: "/TextureTransform",
            element: withLoadingComponent(<TextureTransform />),
          },
          {
            label: "不同格式纹理",
            key: "/KTX2_DDS_TGATexture",
            path: "/KTX2_DDS_TGATexture",
            element: withLoadingComponent(<KTX2_DDS_TGATexture />),
          },
          {
            label: "色调映射",
            key: "/RendererToneMapping",
            path: "/RendererToneMapping",
            element: withLoadingComponent(<RendererToneMapping />),
          },
          {
            label: "exr_tif_png动态范围图",
            key: "/EXR_TIF_PngDynamicRangeImg",
            path: "/EXR_TIF_PngDynamicRangeImg",
            element: withLoadingComponent(<EXR_TIF_PngDynamicRangeImg />),
          },
          {
            label: "深度渲染",
            key: "/DepthRender",
            path: "/DepthRender",
            element: withLoadingComponent(<DepthRender />),
          },
          {
            label: "材质混合",
            key: "/MaterialMixin",
            path: "/MaterialMixin",
            element: withLoadingComponent(<MaterialMixin />),
          },
          {
            label: "渲染冰果汁",
            key: "/RenderIceJuice",
            path: "/RenderIceJuice",
            element: withLoadingComponent(<RenderIceJuice />),
          },
          {
            label: "裁剪材料",
            key: "/ClipMaterial",
            path: "/ClipMaterial",
            element: withLoadingComponent(<ClipMaterial />),
          },
          {
            label: "裁剪场景",
            key: "/ClipScene",
            path: "/ClipScene",
            element: withLoadingComponent(<ClipScene />),
          },
          {
            label: "模板渲染",
            key: "/TemplateRender",
            path: "/TemplateRender",
            element: withLoadingComponent(<TemplateRender />),
          },
          {
            label: "使用Depth模板渲染",
            key: "/RenderMetalSection",
            path: "/RenderMetalSection",
            element: withLoadingComponent(<RenderMetalSection />),
          },
        ],
      },
      {
        label: "灯光与阴影",
        key: "LightsAndShadows",
        children: [
          {
            label: "环境光与平行光",
            key: "/AmbientLightAndDirectionalLight",
            path: "/AmbientLightAndDirectionalLight",
            element: withLoadingComponent(<AmbientLightAndDirectionalLight />),
          },
          {
            label: "使用聚光灯",
            key: "/UseSpotLight",
            path: "/UseSpotLight",
            element: withLoadingComponent(<UseSpotLight />),
          },
          {
            label: "使用点光源",
            key: "/UsePointLight",
            path: "/UsePointLight",
            element: withLoadingComponent(<UsePointLight />),
          },
          {
            label: "使用点光源",
            key: "/TransparentTextureAndShadowSetting",
            path: "/TransparentTextureAndShadowSetting",
            element: withLoadingComponent(
              <TransparentTextureAndShadowSetting />
            ),
          },
          {
            label: "大场景级联阴影设置",
            key: "/LargeSceneCascadeShadowSettings",
            path: "/LargeSceneCascadeShadowSettings",
            element: withLoadingComponent(<LargeSceneCascadeShadowSettings />),
          },
        ],
      },
      {
        label: "操作物体",
        key: "ManipulatingObjects",
        children: [
          {
            label: "PlaceObjects",
            key: "/PlaceObjects",
            path: "/PlaceObjects",
            element: withLoadingComponent(<PlaceObjects />),
          },
        ],
      },
      {
        label: "动画",
        key: "Animation",
        children: [
          {
            label: "使用动画",
            key: "/UseAnimation",
            path: "/UseAnimation",
            element: withLoadingComponent(<UseAnimation />),
          },
          {
            label: "创建关键帧",
            key: "/CreateKeyframes",
            path: "/CreateKeyframes",
            element: withLoadingComponent(<CreateKeyframes />),
          },
          {
            label: "单一关键帧",
            key: "/NumberKeyframes",
            path: "/NumberKeyframes",
            element: withLoadingComponent(<NumberKeyframes />),
          },
          {
            label: "动画混合器",
            key: "/AnimationMixer",
            path: "/AnimationMixer",
            element: withLoadingComponent(<AnimationMixer />),
          },
          {
            label: "gsap动画",
            key: "/GsapAnimate",
            path: "/GsapAnimate",
            element: withLoadingComponent(<GsapAnimate />),
          },
        ],
      },
      {
        label: "粒子特效",
        key: "ParticleEffects",
        children: [
          {
            label: "使用点材质",
            key: "/UsePointMaterial",
            path: "/UsePointMaterial",
            element: withLoadingComponent(<UsePointMaterial />),
          },
          {
            label: "随机点",
            key: "/RandomPoints",
            path: "/RandomPoints",
            element: withLoadingComponent(<RandomPoints />),
          },
          {
            label: "模拟星系",
            key: "/SimulatingGalaxy",
            path: "/SimulatingGalaxy",
            element: withLoadingComponent(<SimulatingGalaxy />),
          },
        ],
      },
      {
        label: "光线投射与物体交互",
        key: "RaycastingAndObjectInteraction",
        children: [
          {
            label: "光线投射到物体",
            key: "/RaycastingInteraction",
            path: "/RaycastingInteraction",
            element: withLoadingComponent(<RaycastingInteraction />),
          },
          {
            label: "光线投射物体交互",
            key: "/RaycastingObjectInteraction",
            path: "/RaycastingObjectInteraction",
            element: withLoadingComponent(<RaycastingObjectInteraction />),
          },
        ],
      },
      {
        label: "应用物理引擎",
        key: "PhysicsEngine",
        children: [
          {
            label: "物体绑定物理引擎",
            key: "/MaterialBindCannon",
            path: "/MaterialBindCannon",
            element: withLoadingComponent(<MaterialBindCannon />),
          },
          {
            label: "方块碰撞",
            key: "/CubeCollision",
            path: "/CubeCollision",
            element: withLoadingComponent(<CubeCollision />),
          },
        ],
      },
      {
        label: "GLSL学习",
        key: "GLSL",
        children: [
          {
            label: "着色器材质",
            key: "/CreateShaderMaterial",
            path: "/CreateShaderMaterial",
            element: withLoadingComponent(<CreateShaderMaterial />),
          },
          {
            label: "glsl内置函数",
            key: "/ShaderObjects",
            path: "/ShaderObjects",
            element: withLoadingComponent(<ShaderObjects />),
          },
          {
            label: "孔明灯",
            key: "/KongmingLantern",
            path: "/KongmingLantern",
            element: withLoadingComponent(<KongmingLantern />),
          },
          {
            label: "烟雾与水",
            key: "/SmokeOrWater",
            path: "/SmokeOrWater",
            element: withLoadingComponent(<SmokeOrWater />),
          },
          {
            label: "Three.jsWater",
            key: "/ThreeJSWater",
            path: "/ThreeJSWater",
            element: withLoadingComponent(<ThreeJSWater />),
          },
          {
            label: "使用着色器绘制粒子",
            key: "/UseShaderCreateParticles",
            path: "/UseShaderCreateParticles",
            element: withLoadingComponent(<UseShaderCreateParticles />),
          },
          {
            label: "使用着色器绘制galaxy",
            key: "/GalaxyShader",
            path: "/GalaxyShader",
            element: withLoadingComponent(<GalaxyShader />),
          },
          {
            label: "烟花shader",
            key: "/FireworksShader",
            path: "/FireworksShader",
            element: withLoadingComponent(<FireworksShader />),
          },
          {
            label: "打击人物",
            key: "/HitCharacters",
            path: "/HitCharacters",
            element: withLoadingComponent(<HitCharacters />),
          },
        ],
      },
      {
        label: "效果合成器",
        key: "EffectComposer",
        children: [
          {
            label: "使用EffectComposer",
            key: "/UseEffectComposer",
            path: "/UseEffectComposer",
            element: withLoadingComponent(<UseEffectComposer />),
          },
        ],
      },
      {
        label: "CSS渲染器",
        key: "CSSRenderer",
        children: [
          {
            label: "CSS2DRender",
            key: "/CSS2DRender",
            path: "/CSS2DRender",
            element: withLoadingComponent(<CSS2DRender />),
          },
        ],
      },
      {
        label: "曲线与轨迹",
        key: "CurvesAndTracks",
        path: "/CurvesAndTracks",
        element: withLoadingComponent(<CurvesAndTracks />),
      },
      {
        label: "形变动画",
        key: "DeformationAnimation",
        path: "/DeformationAnimation",
        element: withLoadingComponent(<DeformationAnimation />),
      },
    ],
  },
  {
    label: "全屏滚动",
    key: "FullScreenScroll",
    path: "/FullScreenScroll",
    element: withLoadingComponent(<FullScreenScroll />),
  },
];

export default routes;
