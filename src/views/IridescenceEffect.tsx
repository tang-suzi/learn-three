import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const IridescenceEffect: FC = () => {
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

    const brickRoughness = new THREE.TextureLoader().load(
      new URL("./../assets/texture/brick/brick_roughness.jpg", import.meta.url)
        .href
    );

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transmission: 1,
      thickness: 0.1,
      iridescence: 1,
      reflectivity: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      iridescenceThicknessMap: brickRoughness,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    gui.add(sphereMaterial, "iridescence", 0, 1, 0.01).name("虹彩效应");
    gui.add(sphereMaterial, "reflectivity", 0, 1, 0.01).name("反射率");
    gui.add(sphereMaterial, "iridescenceIOR", 1, 3, 0.01).name("虹彩折射率");
    gui
      .add({ min: 100 }, "min", 0, 1000)
      .name("虹彩厚度最小值")
      .onChange((e) => {
        sphereMaterial.iridescenceThicknessRange[0] = e;
      });
    gui
      .add({ max: 400 }, "max", 0, 1000)
      .name("虹彩厚度最大值")
      .onChange((e) => {
        sphereMaterial.iridescenceThicknessRange[1] = e;
      });

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

export default IridescenceEffect;
