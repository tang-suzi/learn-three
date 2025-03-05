import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const PhongMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
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
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        // 设置球形贴图
        // envMap.mapping = THREE.EquirectangularReflectionMapping; // 反射映射
        envMap.mapping = THREE.EquirectangularRefractionMapping; // 折射映射
        // 设置环境贴图
        scene.background = envMap;
        // 设置环境贴图
        scene.environment = envMap;
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          new URL("./../assets/model/Duck.glb", import.meta.url).href,
          (gltf) => {
            scene.add(gltf.scene);
            const duckMesh = gltf.scene.getObjectByName("LOD3spShape");
            const preMaterial = duckMesh.material;
            duckMesh.material = new THREE.MeshPhongMaterial({
              // color: 0xffffff,
              map: preMaterial.map,
              refractionRatio: 0.7, // 折射率
              reflectivity: 0.99, // 折射强度
              envMap: envMap,
            });
          }
        );
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

export default PhongMaterial;
