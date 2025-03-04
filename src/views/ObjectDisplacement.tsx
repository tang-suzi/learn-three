import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

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
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    // gui 实现全屏幕
    gui.add(
      {
        Fullscreen: async () => {
          await threeDemo.current?.requestFullscreen();
          setTimeout(() => {
            if (document.fullscreenElement) {
              camera.aspect =
                threeDemo.current?.clientWidth /
                threeDemo.current?.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(
                threeDemo.current?.clientWidth,
                threeDemo.current?.clientHeight
              );
            }
          }, 200);
        },
      },
      "Fullscreen"
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // 设置元素为线框模式
    parentMaterial.wireframe = true;
    const parentCube = new THREE.Mesh(geometry, parentMaterial);
    parentCube.position.set(-3, 0, 0);
    // 设置缩放
    parentCube.scale.set(2, 2, 2);
    // 设置旋转 x, y, z
    parentCube.rotation.set(Math.PI / 6, 0, 0);
    scene.add(parentCube);
    const cube = new THREE.Mesh(geometry, material);
    //  修改元素位置
    cube.position.set(3, 0, 0);
    cube.scale.set(2, 2, 2);
    parentCube.add(cube);
    // 使用gui控制立方体位置
    // gui.add(cube.position, "x", -5, 5).name("立方体X轴位置");
    const folder = gui.addFolder("立方体位置");
    folder
      .add(cube.position, "x", -5, 5)
      .name("立方体X轴位置")
      .onChange((value: number) => {
        console.log(value);
      })
      .onFinishChange((value) => {
        console.log("finish", value);
      });
    folder.add(cube.position, "y", -5, 5).name("立方体Y轴位置");
    folder.add(cube.position, "z", -5, 5).name("立方体Z轴位置");
    gui.add(parentMaterial, "wireframe").name("父元素线框模式");
    gui
      .addColor({ parentCubeColor: "#ff0000" }, "parentCubeColor")
      .name("父元素颜色")
      .onChange((val) => {
        parentCube.material.color.set(val);
      });
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
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default ObjectDisplacement;
