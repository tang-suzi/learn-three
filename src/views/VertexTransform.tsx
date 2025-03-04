import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const VertexTransform: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    );
    geometry.translate(2, 0, 0); // 移动顶点位置
    geometry.rotateX(Math.PI / 4); // 旋转顶点位置
    geometry.scale(0.5, 0.5, 0.5); // 缩放顶点位置
    plane.position.set(1, 1, 0);
    scene.add(plane);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
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

export default VertexTransform;
