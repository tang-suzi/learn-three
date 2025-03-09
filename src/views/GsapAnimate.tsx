import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const GsapAnimate: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth || 400,
      threeDemo.current?.clientHeight || 400
    );
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    threeDemo.current?.appendChild(renderer.domElement);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const animate = gsap.to(cube.position, {
      x: 5,
      duration: 1,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
      onComplete: () => {
        console.log("动画完成");
      },
      onStart: () => {
        console.log("动画开始");
      },
    });

    const animate1 = gsap.to(cube.rotation, {
      x: 2 * Math.PI,
      duration: 5,
      ease: "power1.inOut",
    });

    threeDemo.current?.addEventListener("dblclick", () => {
      if (animate.isActive()) {
        //   暂停
        animate.pause();
      } else {
        //   恢复
        animate.resume();
      }
    });

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const render = () => {
      requestAnimationFrame(render);
      controls.update();
      renderer?.render(scene!, camera!);
    };
    render();
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

export default GsapAnimate;
