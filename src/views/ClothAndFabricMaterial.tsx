import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const ClothAndFabricMaterial: FC = () => {
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
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const rgbeLoader = new RGBELoader();

    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = envMap;
        scene.environment = envMap;
      }
    );

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
    let brickRoughness = new THREE.TextureLoader().load(
      new URL("./../assets/texture/brick/brick_roughness.jpg", import.meta.url)
        .href
    );

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x880088,
      sheen: 1,
      sheenColor: 0xffffff,
      roughness: 1,
      sheenRoughness: 1,
      sheenColorMap: brickRoughness,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    gui.add(sphereMaterial, "sheen", 0, 1).name("光泽层强度");
    gui.add(sphereMaterial, "sheenRoughness", 0, 1).name("光泽层粗糙度");
    gui.addColor(sphereMaterial, "sheenColor").name("光泽颜色");
    gui.add(sphereMaterial, "roughness", 0, 1).name("粗糙度");

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
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default ClothAndFabricMaterial;
