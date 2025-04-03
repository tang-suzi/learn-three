import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const MaterialBindCannon: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let world: CANNON.World | null = null;
  let sphereBody: CANNON.Body | null = null;
  let sphereMesh: THREE.Mesh | null = null;
  let controls: OrbitControls | null = null;
  const clock = new THREE.Clock();
  const addLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene?.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene?.add(directionalLight);
  };
  const createRes = () => {
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
    });
    sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    scene.add(sphereMesh);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial()
    );
    plane.position.set(0, -5, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
  };
  const createWorld = () => {
    world = new CANNON.World(); // 创建世界
    world.gravity.set(0, -9.8, 0); // 设置重力
    const sphereShape = new CANNON.Sphere(1); // 创建物理小球形状
    const sphereWorldMaterial = new CANNON.Material(); // 设置物体材质
    // 创建世界中的物体
    sphereBody = new CANNON.Body({
      mass: 1, // 小球质量
      shape: sphereShape, // 物体形状
      material: sphereWorldMaterial, // 物体材质
      position: new CANNON.Vec3(0, 0, 0), // 物体位置
    });
    world.addBody(sphereBody);

    // 创建世界中的地面
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.position.set(0, -5, 0);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floorBody);
  };
  const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    threeDemo.current?.appendChild(renderer.domElement);
    addLight();
    createWorld();
    createRes();
    const animate = () => {
      const deltaTime = clock.getDelta();
      world.step(1 / 60, deltaTime); // 更新世界中的物体
      sphereMesh.position.copy(sphereBody.position); // 拷贝世界物体的位置
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
  });
  return <div ref={threeDemo}></div>;
};

export default MaterialBindCannon;
