import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const LambertMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 2, 10);
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const textureLoader = new THREE.TextureLoader();

    const colorTexture = textureLoader.load(
      new URL(
        "./../assets/texture/watercover/CityNewYork002_COL_VAR1_1K.png",
        import.meta.url
      ).href
    );
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    // 高光贴图
    const specularTexture = textureLoader.load(
      new URL(
        "./../assets/texture/watercover/CityNewYork002_GLOSS_1K.jpg",
        import.meta.url
      ).href
    );
    // 法线贴图
    const normalTexture = textureLoader.load(
      new URL(
        "./../assets/texture/watercover/CityNewYork002_NRM_1K.jpg",
        import.meta.url
      ).href
    );
    // 凹凸贴图
    const dispTexture = textureLoader.load(
      new URL(
        "./../assets/texture/watercover/CityNewYork002_DISP_1K.jpg",
        import.meta.url
      ).href
    );
    // 环境光遮蔽贴图
    const aoTexture = textureLoader.load(
      new URL(
        "./../assets/texture/watercover/CityNewYork002_AO_1K.jpg",
        import.meta.url
      ).href
    );

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
    const planeMaterial = new THREE.MeshLambertMaterial({
      map: colorTexture, // 纹理
      specularMap: specularTexture, // 反射贴图
      transparent: true,
      normalMap: normalTexture, // 法线贴图
      bumpMap: dispTexture, // 凹凸贴图
      displacementMap: dispTexture, // 置换贴图
      displacementScale: 0.02,
      aoMap: aoTexture, // 环境光遮蔽贴图
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // rgbeLoader 加载hdr贴图
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        // 设置球形贴图
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 设置环境贴图
        scene.background = envMap;
        // 设置环境贴图
        scene.environment = envMap;
        // planeMaterial.envMap = envMap;
      }
    );

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
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
    <div ref={threeDemo} style={{ width: "400px", height: "400px" }}></div>
  );
};

export default LambertMaterial;
