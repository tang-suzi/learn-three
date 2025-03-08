import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const ClipMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  //   let controls: any | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 50);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        // 设置球形贴图
        // envMap.mapping = THREE.EquirectangularReflectionMapping;
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        // 设置环境贴图
        scene.background = envMap;
        // 设置环境贴图
        scene.environment = envMap;
      }
    );

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const plane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    material.clippingPlanes = [plane, plane1];
    material.clipIntersection = true; // 裁剪平面并集 默认为false交集
    renderer.localClippingEnabled = true;
    material.clipShadows = true; // 裁剪阴影
    plane.constant = 5;

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    const folder = gui.addFolder("裁剪平面");
    // 添加一个滑块
    folder.add(plane, "constant", -10, 10).name("位置");
    // // 设置plane的normal属性
    folder.add(plane.normal, "x", -1, 1).name("法向量x");
    folder.add(plane.normal, "y", -1, 1).name("法向量y");
    folder.add(plane.normal, "z", -1, 1).name("法向量z");

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer?.render(scene!, camera!);
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

export default ClipMaterial;
