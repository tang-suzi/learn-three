import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const RefractiveIndexAndReflectivity: FC = () => {
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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      transparent: true,
      transmission: 0.95,
      roughness: 0.05,
      thickness: 2,
      attenuationColor: new THREE.Color(0.9, 0.9, 0),
      attenuationDistance: 1,
      ior: 0.5,
      reflectivity: 0.5,
    });
    
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    gui.add(material, "ior").min(0.5).max(2).name("折射率")
    gui.add(material, "reflectivity").min(0).max(1).name("反射率")

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

export default RefractiveIndexAndReflectivity;
