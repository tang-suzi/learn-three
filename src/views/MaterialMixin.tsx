import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const MaterialMixin: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gui: GUI | null = null;
  let rgbeLoader: RGBELoader | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        console.log(envMap);
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = envMap;
        scene.environment = envMap;
      }
    );

    const planeTexture = new THREE.TextureLoader().load(
      new URL("./../assets/texture/sprite0.png", import.meta.url).href
    );
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: planeTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    // 设置混合方程式 最终颜色 = 源颜色 * 源因子 + 目标颜色 * 目标因子
    planeMaterial.blending = THREE.CustomBlending;
    planeMaterial.blendEquationAlpha = THREE.AddEquation;
    planeMaterial.blendSrcAlpha = THREE.OneFactor;
    planeMaterial.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;

    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    const folder = gui.addFolder("plane");
    folder
      .add(planeMaterial, "blending", {
        不混合: THREE.NoBlending,
        默认混合: THREE.NormalBlending, // 默认
        添加混合: THREE.AdditiveBlending,
        减法混合: THREE.SubtractiveBlending,
        多重混合: THREE.MultiplyBlending,
        定制混合: THREE.CustomBlending,
      })
      .name("混合模式");
    folder
      .add(planeMaterial, "blendEquation", {
        默认: THREE.AddEquation,
        减法: THREE.SubtractEquation,
        反转减法: THREE.ReverseSubtractEquation,
        最小值: THREE.MinEquation,
        最大值: THREE.MaxEquation,
      })
      .name("混合方程");
    folder
      .add(planeMaterial, "blendSrc", {
        ZeroFactor: THREE.ZeroFactor,
        OneFactor: THREE.OneFactor,
        SrcColorFactor: THREE.SrcColorFactor,
        OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
        SrcAlphaFactor: THREE.SrcAlphaFactor,
        OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
        DstAlphaFactor: THREE.DstAlphaFactor,
        OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
        DstColorFactor: THREE.DstColorFactor,
        OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
        SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
      })
      .name("源因子");
    folder
      .add(planeMaterial, "blendDst", {
        ZeroFactor: THREE.ZeroFactor,
        OneFactor: THREE.OneFactor,
        SrcColorFactor: THREE.SrcColorFactor,
        OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
        SrcAlphaFactor: THREE.SrcAlphaFactor,
        OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
        DstAlphaFactor: THREE.DstAlphaFactor,
        OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
        DstColorFactor: THREE.DstColorFactor,
        OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
        // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
      })
      .name("目标因子");
    folder
      .add(planeMaterial, "blendSrcAlpha", {
        ZeroFactor: THREE.ZeroFactor,
        OneFactor: THREE.OneFactor,
        SrcColorFactor: THREE.SrcColorFactor,
        OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
        SrcAlphaFactor: THREE.SrcAlphaFactor,
        OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
        DstAlphaFactor: THREE.DstAlphaFactor,
        OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
        DstColorFactor: THREE.DstColorFactor,
        OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
        SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
      })
      .name("源混合因子");
    folder
      .add(planeMaterial, "blendDstAlpha", {
        ZeroFactor: THREE.ZeroFactor,
        OneFactor: THREE.OneFactor,
        SrcColorFactor: THREE.SrcColorFactor,
        OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
        SrcAlphaFactor: THREE.SrcAlphaFactor,
        OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
        DstAlphaFactor: THREE.DstAlphaFactor,
        OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
        DstColorFactor: THREE.DstColorFactor,
        OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
        // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
      })
      .name("目标混合因子");

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const animate = () => {
      requestAnimationFrame(animate);
      controls?.update();
      renderer.render(scene!, camera!);
    };
    animate();
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
    }
  }, []);
  return (
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default MaterialMixin;
