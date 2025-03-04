import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import textureImg from "./../assets/texture/watercover/CityNewYork002_COL_VAR1_1K.png";
import textureImgAo from "./../assets/texture/watercover/CityNewYork002_AO_1K.jpg";
// import alphaImg from "./../assets/texture/door/height.jpg";
// import lightImg from "./../assets/texture/colors.png";
import specularImg from "./../assets/texture/watercover/CityNewYork002_GLOSS_1K.jpg";

const AddMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = async () => {
    if (hasInit.current) return;
    hasInit.current = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const planeGeometry = new THREE.PlaneGeometry(1, 1);

    const textureLoader = new THREE.TextureLoader();
    // 加载贴图
    const texture = textureLoader.load(textureImg);
    // texture.colorSpace = THREE.NoColorSpace; // 默认线性空间
    // texture.colorSpace = THREE.LinearSRGBColorSpace; // 默认线性空间
    texture.colorSpace = THREE.SRGBColorSpace; // 纹理颜色空间
    // 加载ao贴图
    const aoMap = textureLoader.load(textureImgAo);
    // 加载透明度贴图
    // const alphaMap = textureLoader.load(alphaImg);
    // 光照贴图
    // const lightMap = textureLoader.load(lightImg);
    // 高光贴图
    const specularMap = textureLoader.load(specularImg);

    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      transparent: true,
      aoMap: aoMap, // ao贴图
      aoMapIntensity: 1, // ao贴图强度
      // alphaMap: alphaMap, // 透明度贴图
      // lightMap: lightMap, // 光照贴图
      specularMap: specularMap, // 高光贴图
      // 反射强度
      reflectivity: 1,
    });
    const rgbeLoader = new RGBELoader();
    const hdrPath = new URL(
      "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
      import.meta.url
    ).href;
    rgbeLoader.load(hdrPath, (envMap) => {
      // 设置球形贴图
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      // 设置环境贴图
      scene.environment = envMap;
      scene.background = envMap;
      // 设置plane的环境贴图
      planeMaterial.envMap = envMap;
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao强度");
    gui
      .add(texture, "colorSpace", {
        sRGB: THREE.SRGBColorSpace,
        Linear: THREE.LinearSRGBColorSpace,
        NoColorSpace: THREE.NoColorSpace,
      })
      .onChange(() => {
        texture.needsUpdate = true;
      });
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default AddMaterial;
