import { FC, useRef, useEffect } from "react";
import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * 添加阴影步骤
 * 1. 设置渲染器允许投射阴影
 * 2. 设置平行光可以投射阴影
 * 3. 设置物体投射阴影
 * 4. 设置地面或平面可以接收阴影
 */
const TransparentTextureAndShadowSetting: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    // 设置渲染器允许投射阴影
    renderer.shadowMap.enabled = true;
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;

    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    // 环境光 不能用来投射阴影，因为它没有方向。
    const ambient = new THREE.HemisphereLight(0xffffff, 0.15);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 5, 0);
    pointLight.castShadow = true;
    pointLight.decay = 0;
    pointLight.distance = 15;
    scene.add(pointLight);

    pointLight.shadow.mapSize.width = 512; // default
    pointLight.shadow.mapSize.height = 512; // default
    pointLight.shadow.camera.near = 0.5; // default
    pointLight.shadow.camera.far = 500; // default
    // pointLight.shadow.bias = -0.01; // 阴影偏移
    const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    scene.add(pointLightHelper);

    gui.add(pointLight, "decay", 0, 10);
    gui.add(pointLight, "distance", 0, 20);
    gui.add(pointLight.shadow.mapSize, "width", 0, 1024);
    gui.add(pointLight.shadow.mapSize, "height", 0, 1024);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material1 = new THREE.MeshPhysicalMaterial({
      color: 0xccccff,
    });
    const torusKnot = new THREE.Mesh(geometry, material1);
    torusKnot.position.set(4, 0, 0);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add(torusKnot);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const material2 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, material2);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    const boxTexture = new THREE.TextureLoader().load(
      new URL("./../assets/texture/16.jpg", import.meta.url).href
    );

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material3 = new THREE.MeshPhysicalMaterial({
      color: 0xffcccc,
      alphaMap: boxTexture,
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
    //   shadowSide: THREE.BackSide, // 消除正面阴影
    });
    const box = new THREE.Mesh(boxGeometry, material3);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(-4, 0, 0);
    scene.add(box);

    const planeGeometry = new THREE.PlaneGeometry(24, 24, 1, 1);
    const planeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x999999,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.set(0, -4, 0);
    // 平面接收阴影
    planeMesh.receiveShadow = true;
    planeMesh.castShadow = true;
    scene.add(planeMesh);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const render = () => {
      requestAnimationFrame(render);
      controls?.update();
      renderer?.render(scene!, camera!);
    };
    render();
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

export default TransparentTextureAndShadowSetting;
