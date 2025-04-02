import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap, { random } from "gsap";
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
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        for (let z = 0; z < 5; z++) {
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(x * 2 - 5, y * 2 - 5, z * 2 - 5);
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
    if (result.length) {
      result.map((item) => {
        item.object.material = material;
      });
    }
  };
  const addListener = () => {
    window.addEventListener("mousemove", (event) => {
      mouse.x = event.clientX / window.innerWidth - 0.5;
      mouse.y = event.clientY / window.innerHeight - 0.5;
    });

    window.addEventListener("click", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      initRaycasting();
    });
    window.addEventListener("resize", resizeWindow);
    let currentPage = 0;
    window.addEventListener("scroll", () => {
      const newPage = Math.round(window.scrollY / window.innerHeight);
      if (newPage !== currentPage) {
        currentPage = newPage;
      }
    });
  };

  // 星系
  const galaxyGroup = new THREE.Group();
  const createGalaxy = () => {
    const params = {
      count: 3000,
      size: 0.1,
      radius: 5,
      branch: 8,
      color: "#ff0000",
      rotateScale: 0.5,
      endColor: "#00ffff",
    };
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../assets/texture/particles/1.png", import.meta.url).href
    );
    const geometry = new THREE.BufferGeometry();
    const centerColor = new THREE.Color(params.color);
    const endColor = new THREE.Color(params.endColor);
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);
    for (let i = 0; i < params.count; i++) {
      // 分支角度
      const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
      // 点位距离圆心的距离
      const distance =
        Math.random() * params.radius * Math.pow(Math.random(), 3);
      const randomX =
        (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
      const randomY =
        (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
      const randomZ =
        (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
      const current = i * 3;
      positions[current] =
        (Math.cos(branchAngel + distance * params.rotateScale) * distance +
          randomX) *
        3;
      positions[current + 1] =
        (Math.sin(branchAngel + distance * params.rotateScale) * distance +
          randomY) *
        3;
      positions[current + 2] = (0 + randomZ) * 3;

      const mixColor = centerColor.clone();
      mixColor.lerp(endColor, distance / params.radius);
      colors[current] = mixColor.r;
      colors[current + 1] = mixColor.g;
      colors[current + 2] = mixColor.b;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: params.size,
      map: texture,
      transparent: true,
      alphaMap: texture,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // 混合模式
      vertexColors: true,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    galaxyGroup.add(points);
    galaxyGroup.position.set(0, -30, 0);
    scene.add(galaxyGroup);
  };
  const randomPointsGroup = new THREE.Group();
  const randomPoints = () => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../assets/texture/particles/1.png", import.meta.url).href
    );
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    const material = new THREE.PointsMaterial({
      size: 0.1,
      map: texture,
      transparent: true,
      alphaMap: texture,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // 混合模式
      vertexColors: true,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(particlesGeometry, material);
    randomPointsGroup.add(points);
    randomPointsGroup.position.y = -65;
    scene.add(randomPointsGroup);
  };
  const init = () => {
    renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
    document.body.appendChild(renderer.domElement);
    createCube();
    createGalaxy();
    randomPoints();
    addListener();
    const animate = () => {
      const time = clock.getElapsedTime();
      const deltaTime = clock.getDelta();
      cubeGroup.rotation.x = time * 0.1;
      cubeGroup.rotation.y = time * 0.1;

      galaxyGroup.rotation.z = time * 0.1;

      randomPointsGroup.rotation.x = time*0.1
      randomPointsGroup.rotation.y = time*0.1

      // 根据屏幕滚动距离设置相机位置
      camera.position.y = -(window.scrollY / window.innerHeight) * 30;

      camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5;

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
      <div className="page page3">
        <h3>随机点</h3>
      </div>
    </>
  );
};

export default FullScreenScroll;
