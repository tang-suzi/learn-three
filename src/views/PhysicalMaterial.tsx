import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const StandardMaterial: FC = () => {
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

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    const thicknessMap = new THREE.TextureLoader().load(
      new URL("./../assets/texture/diamond/diamond_emissive.png", import.meta.url).href
    );

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      transparent: true,
      transmission: 0.9,
      roughness: 0.05,
      thickness: 2,
      attenuationColor: new THREE.Color(0.9, 0.9, 0),
      attenuationDistance: 1,
      thicknessMap: thicknessMap,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    gui.add({ transparent: true }, "transparent").onChange((e) => {
      material.transparent = e;
    });
    gui.add(material, "transmission").min(0).max(1).step(0.01).name("透光率");
    gui.add(material, "roughness").min(0).max(1).step(0.01).name("粗糙度");
    gui.add(material, "thickness").min(0).max(10).step(0.01).name("厚度");
    gui.addColor(material, "attenuationColor").name("衰减颜色");
    gui.add(material, "attenuationDistance").min(0).max(10).name("衰减距离");

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

export default StandardMaterial;
