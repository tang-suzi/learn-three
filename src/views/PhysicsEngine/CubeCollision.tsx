import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
const CubeCollision: FC = () => {
  const threeDemoRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let world: CANNON.World | null = null;
  let cubeMaterial: CANNON.Material | null = null;
  let floorMaterial: CANNON.Material | null = null;
  const cubeArr = new Array<THREE.Mesh>();
  const clock = new THREE.Clock();
  const createLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight);
  };
  const createFloor = () => {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0x999999,
    });
    const floorMesh = new THREE.Mesh(geometry, material);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -5;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      shape: floorShape,
      mass: 0,
      position: new CANNON.Vec3(0, -5, 0),
      quaternion: new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
      ),
      material: floorMaterial,
    });

    world?.addBody(floorBody);
  };
  const createCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({});
    const cubeMesh = new THREE.Mesh(geometry, material);
    cubeMesh.castShadow = true;
    console.log(cubeMesh);
    material.color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    );
    scene.add(cubeMesh);

    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const cubeBody = new CANNON.Body({
      shape: cubeShape,
      mass: 1,
      position: new CANNON.Vec3(0, 0, 0),
      material: cubeMaterial,
    });
    // cubeBody 添加力 （力度， 施加点）
    cubeBody.applyLocalForce(
      new CANNON.Vec3(300, 0, 0),
      new CANNON.Vec3(0, 0, 0)
    );
    cubeArr.push({ mesh: cubeMesh, body: cubeBody });
    world?.addBody(cubeBody);
  };
  const initWorld = () => {
    world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.8, 0),
    });
    cubeMaterial = new CANNON.Material("cube");
    floorMaterial = new CANNON.Material("floor");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      cubeMaterial,
      floorMaterial,
      {
        friction: 0.4,
        restitution: 0.3,
      }
    );
    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;
  };
  const animate = () => {
    const deltaTime = clock.getDelta();
    renderer.render(scene, camera);
    world.step(1 / 120, deltaTime);
    cubeArr.forEach((item) => {
      item.mesh.position.copy(item.body.position); // 物理引擎位置
      item.mesh.quaternion.copy(item.body.quaternion); // 物理引擎旋转
    });

    requestAnimationFrame(animate);
  };
  const addListener = () => {
    window.addEventListener("click", createCube);
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemoRef.current?.parentNode.clientWidth /
        threeDemoRef.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(
      threeDemoRef.current?.parentNode.clientWidth,
      threeDemoRef.current?.parentNode.clientHeight
    );
    threeDemoRef.current.appendChild(renderer.domElement);
    initWorld();
    createLight();
    createCube();
    createFloor();
    addListener();
    animate();
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
    }
  }, []);
  return <div ref={threeDemoRef}></div>;
};

export default CubeCollision;
