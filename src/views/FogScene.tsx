import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const FogScene: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    if (hasInit.current) return;
    hasInit.current = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 50);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    scene.fog = new THREE.Fog(0x999999, 0.1, 20); // 场景fog
    // scene.fog = new THREE.FogExp2(0x999999, 0.1); // 场景指数fog (颜色, 密度)
    scene.background = new THREE.Color(0x999999); // 背景颜色要于雾的颜色几乎一致
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    const gui = new GUI();
    gui
      .addColor({ fogColor: "#999" }, "fogColor")
      .name("雾颜色")
      .onChange((val:string) => {
        scene.fog.color.set(val);
      });
    gui
      .add(scene.fog, "near", 0.1, 20)
      .name("雾近端")
      .onChange(() => {
        scene.fog.near = scene.fog?.near || 0;
      });
    gui
      .add(scene.fog, "far", 1, 20)
      .name("雾远端")
      .onChange(() => {
        scene.fog.far = scene.fog?.far || 0;
      });
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    animate();
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default FogScene;
