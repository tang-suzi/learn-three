import { relative } from "path";
import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
const RaycastingInteraction: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    if (hasInit.current) return;
    hasInit.current = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    camera.position.set(5, 2, 10);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);

    // 创建图形
    const sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    sphere1.position.set(-4, 0, 0);
    scene.add(sphere1);
    const sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    sphere2.position.set(4, 0, 0);
    scene.add(sphere2);
    const sphere3 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    sphere3.position.set(0, 0, 0);
    scene.add(sphere3);

    // 创建射线
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const boxPosition = threeDemo.current?.getBoundingClientRect();
    threeDemo.current?.addEventListener("click", (e) => {
      mouse.x = ((e.clientX - boxPosition?.left) / boxPosition?.width) * 2 - 1;
      mouse.y = -((e.clientY - boxPosition?.top) / boxPosition?.height) * 2 + 1;
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera);

      // 计算物体和射线的焦点
      const intersects = raycaster.intersectObjects([
        sphere1,
        sphere2,
        sphere3,
      ]);
      if (intersects.length > 0) {
        if (intersects[0].object._isSelect) {
          intersects[0].object.material.color.set(
            intersects[0].object._originColor
          );
          intersects[0].object._isSelect = false;
          return;
        }

        intersects[0].object._isSelect = true;
        intersects[0].object._originColor =
          intersects[0].object.material.color.getHex();
        intersects[0].object.material.color.set(0xffff00);
      }
    });

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
    init();
  }, []);
  return (
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default RaycastingInteraction;
