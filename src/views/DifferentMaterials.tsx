import { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DifferentMaterials: FC = () => {
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
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true,
        wireframeLinewidth: 0.1,
        transparent: true,
        opacity: 0,
      }),
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    ];

    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(0, 0, 0);
    cube.position.set(1, 1, 1);
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
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

export default DifferentMaterials;
