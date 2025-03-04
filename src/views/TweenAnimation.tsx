import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

const TweenAnimation: FC = () => {
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
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    const tween = new TWEEN.Tween(sphere.position);
    // tween.to({ x: 4 }, 1000);
    // // tween.repeat(Infinity); // 无限循环
    // // tween.yoyo(true).repeat(2); // 循环往复2次
    // // tween.delay(3000); // 延迟时间
    // tween.easing(TWEEN.Easing.Quadratic.InOut); // 缓动函数
    // const tween1 = new TWEEN.Tween(sphere.position);
    // tween1.to({ x: -4 }, 1000);
    // tween.chain(tween1);
    // tween1.chain(tween);
    // tween.start();
    tween.to({ x: 4 }, 1000);
    // tween.easing(TWEEN.Easing.Quadratic.InOut);

    const tween1 = new TWEEN.Tween(sphere.position);
    tween1.to({ x: 0 }, 1000); // 让它回到 0
    const tween2 = new TWEEN.Tween(sphere.position);
    tween2.to({ x: -4 }, 1000);

    tween.chain(tween2); // 4 → -4
    tween2.chain(tween1); // -4 → 0
    tween1.chain(tween); // 0 → 4，形成完整循环

    tween.start();
    tween.onStart(() => {
      console.log("开始");
    });
    tween.onComplete(() => {
      console.log("结束");
    });
    tween.onStop(() => {
      console.log("停止");
    });
    tween.onUpdate(() => {
      console.log("更新");
    });

    gui.add(
      {
        stop: () => {
          tween.stop();
        },
      },
      "stop"
    );
    gui.add(
      {
        start: () => {
          tween.start();
        },
      },
      "start"
    );

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      TWEEN.update();
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

export default TweenAnimation;
