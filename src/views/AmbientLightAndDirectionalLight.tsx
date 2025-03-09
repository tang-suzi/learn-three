import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

/**
 * 添加阴影步骤
 * 1. 设置渲染器允许投射阴影
 * 2. 设置平行光可以投射阴影
 * 3. 设置物体投射阴影
 * 4. 设置地面或平面可以接收阴影
 */
const AmbientLightAndDirectionalLight: FC = () => {
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    // 平行光 可以投射阴影，灯光有范围
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 0);
    // 默认平行光的目标是原点
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);

    // 设置光投射阴影
    directionalLight.castShadow = true;

    // 平行光相机属性
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    // directionalLight.shadow.camera.near = 0.5;
    // directionalLight.shadow.camera.far = 50;
    const directionalLightFolder = gui.addFolder("平行光");
    directionalLightFolder.add(directionalLight.shadow.camera, "left", -10, 10);
    directionalLightFolder.add(directionalLight.shadow.camera, "top", -10, 10);
    directionalLightFolder.add(
      directionalLight.shadow.camera,
      "right",
      -10,
      10
    );
    directionalLightFolder.add(
      directionalLight.shadow.camera,
      "bottom",
      -10,
      10
    );
    directionalLightFolder.add(directionalLight.shadow.camera, "near", -10, 10);
    directionalLightFolder.add(directionalLight.shadow.camera, "far", -10, 500);
    // 平行光辅助线
    const directionalLightHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    scene.add(directionalLightHelper);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material1 = new THREE.MeshPhysicalMaterial({
      color: 0xccccff,
    });
    const torusKnot = new THREE.Mesh(geometry, material1);
    torusKnot.position.set(4, 0, 0);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add(torusKnot);
    console.log(gui)

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const material2 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, material2);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    gui.add(sphere.position, "z", -10, 10).name("小球Z轴位置");

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material3 = new THREE.MeshPhysicalMaterial({
      color: 0xffcccc,
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
      directionalLight.shadow.camera.updateProjectionMatrix();
      directionalLightHelper.update();
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

export default AmbientLightAndDirectionalLight;
