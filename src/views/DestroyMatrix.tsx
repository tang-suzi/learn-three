import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DestroyMatrix: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let sphere: THREE.Mesh | null = null;
  let sphereGeometry: THREE.SphereGeometry | null = null;
  let sphereMaterial: THREE.MeshBasicMaterial | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let animateId: number;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    const animate = () => {
      animateId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  const destroyed = () => {
    scene.remove(sphere);
    sphereGeometry.dispose();
    sphereMaterial.dispose();
    cancelAnimationFrame(animateId);
    renderer.render(scene, camera);
    renderer.dispose();
  };
  useEffect(() => {
    if (hasInit.current) return;
    init();
    hasInit.current = true;
  }, []);
  return (
    <>
      <div ref={threeDemo} style={{ width: "400px", height: "400px" }}></div>
      <button onClick={destroyed}>卸载模型</button>
    </>
  );
};

export default DestroyMatrix;
