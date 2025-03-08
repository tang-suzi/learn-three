import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const DepthTestExample: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;

  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(2, 24, 50);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth || 400,
      threeDemo.current?.clientHeight || 400
    );
    renderer.setClearColor(0x000000); // 背景黑色
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
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        scene.background = envMap;
        scene.environment = envMap;
      }
    );
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshPhysicalMaterial({
      // side: THREE.DoubleSide,
      side: THREE.FrontSide,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const material1 = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: 0xffcccc,
      stencilWrite: true,
      stencilRef: 1,
      stencilWriteMask: 0xff,
      stencilZPass: THREE.ReplaceStencilOp,
    });
    const torusKnot1 = new THREE.Mesh(geometry, material1);
    scene.add(torusKnot1);

    // 创建裁剪平面
    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    material.clippingPlanes = [plane];
    material1.clippingPlanes = [plane];
    renderer.localClippingEnabled = true;
    // // 设置裁剪阴影

    // 创建一个gui
    const folder = gui.addFolder("裁剪平面");
    // 添加一个滑块
    folder.add(plane, "constant", -10, 10).name("位置");
    // // 设置plane的normal属性
    folder.add(plane.normal, "x", -1, 1).name("法向量x");
    folder.add(plane.normal, "y", -1, 1).name("法向量y");
    folder.add(plane.normal, "z", -1, 1).name("法向量z");

    // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1);
    const planeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xccccff,
      metalness: 0.95,
      roughness: 0.1,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.EqualStencilFunc,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    scene.add(planeMesh);
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

export default DepthTestExample;
