import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ObjectDisplacement: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    if (hasInit.current) return;
    hasInit.current = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const parentCube = new THREE.Mesh(geometry, parentMaterial);
    parentCube.position.set(-3, 0, 0);
    scene.add(parentCube);
    const cube = new THREE.Mesh(geometry, material);
    //  修改元素位置
    // cube.position.x = 2;
    cube.position.set(3, 0, 0);
    parentCube.add(cube);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const controls = new OrbitControls(camera, renderer.domElement);
    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div ref={threeDemo} style={{ width: "400px", height: "400px" }}></div>
  );
};

export default ObjectDisplacement;
