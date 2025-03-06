import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const SettingControls: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls = null;
  let rgbeLoader: RGBELoader = null;
  let gltfLoader: GLTFLoader = null;
  let dracoLoader: DRACOLoader = null;

  const init = async () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 1000);
    camera.position.set(5, 1.8, 0);
    camera.lookAt(0, 2, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器
    // 设置带阻尼的惯性
    controls.enableDamping = true;
    // 设置阻尼系数
    controls.dampingFactor = 0.05;
    // 设置旋转速度
    // controls.autoRotate = true;
    controls.target.set(0, 1.2, 0);
    // 禁用平移
    controls.enablePan = false;
    // 设置最小距离
    controls.minDistance = 3;
    // 设置最大距离
    controls.maxDistance = 5;
    // 设置垂直的最小角度
    controls.minPolarAngle = Math.PI / 2 - Math.PI / 12;
    // 设置垂直的最大角度
    controls.maxPolarAngle = Math.PI / 2;

    // 设置水平的最小角度
    controls.minAzimuthAngle = Math.PI / 2 - Math.PI / 12;
    // 设置水平的最大角度
    controls.maxAzimuthAngle = Math.PI / 2 + Math.PI / 12;
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    rgbeLoader = new RGBELoader();
    gltfLoader = new GLTFLoader();
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
    await gltfLoader.load(
      new URL("./../assets/model/liveroom-scene.glb", import.meta.url).href,
      (gltf) => {
        scene.add(gltf.scene);
      }
    );

    await rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        scene.background = new THREE.Color(0xe2d0e0);
        scene.environment = envMap;
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    if (!hasInit.current) {
      init();
      hasInit.current = true;
    }
  }, []);
  return (
    <div ref={threeDemo} style={{ width: "384px", height: "216px" }}></div>
  );
};
export default SettingControls;
