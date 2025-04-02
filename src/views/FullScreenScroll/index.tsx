import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

import "./index.css";

const FullScreenScroll: FC = () => {
  const hasInit = useRef<boolean>(false);
  let animateId: number;
  const navigate = useNavigate();
  const backhome = () => {
    window.removeEventListener("scroll", () => {});
    window.removeEventListener("click", () => {});
    window.removeEventListener("mousemove", () => {});
    window.removeEventListener("resize", resizeWindow);
    cancelAnimationFrame(animateId);
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    document.body.removeChild(renderer.domElement);
    renderer.dispose();
    navigate("/");
  };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / ((window.innerWidth / 16) * 9),
    0.1,
    1000
  );
  const clock = new THREE.Clock();
  camera.position.set(0, 0, 18);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const resizeWindow = () => {
    camera.aspect = window.innerWidth / ((window.innerWidth / 16) * 9);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
    renderer.setPixelRatio(window.devicePixelRatio);
  };
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const cubeArr = [];
  const cubeGroup = new THREE.Group();
  const createCube = () => {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    for (let x = -5; x < 5; x++) {
      for (let y = -5; y < 5; y++) {
        for (let z = -5; z < 5; z++) {
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(x, y, z);
          cubeGroup?.add(cube);
          cubeArr.push(cube);
        }
      }
    }
    scene.add(cubeGroup);
  };
  const initRaycasting = () => {
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    raycaster.setFromCamera(mouse, camera!);
    const result = raycaster.intersectObjects(cubeArr);
    console.log(result);
    if (result.length) {
      result.map((item) => {
        item.object.material = material;
      });
    }
  };
  const addListener = () => {
    // window.addEventListener("mousemove", (event) => {
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // });

    window.addEventListener("click", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      initRaycasting();
    });
  };
  const init = () => {
    renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
    document.body.appendChild(renderer.domElement);
    addListener();
    createCube();
    const animate = () => {
      const time = clock.getElapsedTime();
      cubeGroup.rotation.x = time * 0.1;
      cubeGroup.rotation.y = time * 0.1;
      console.log(cubeGroup);
      animateId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      // 监听画面变化，更新渲染画面
      init();
      window.addEventListener("resize", resizeWindow);
    }
  }, []);
  return (
    <>
      <button onClick={backhome}>backHome</button>
      <div className="page page1">
        <h3>光线投射3D场景交互</h3>
      </div>
      <div className="page page2">
        <h3>星系</h3>
      </div>
    </>
  );
};

export default FullScreenScroll;
