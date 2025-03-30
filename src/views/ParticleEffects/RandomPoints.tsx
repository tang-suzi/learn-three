import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const RandomPoints: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let girdHelper: THREE.GridHelper | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.Texture | null = null;
  const params: object = {
    count: 5000,
    size: 0.1,
    radius: 5,
    branch: 3,
    color: "#ffae23",
    rotateScale: 0.3,
    endColor: "#1b315e",
  };
  const createRandomPoint = () => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../assets/texture/particles/1.png", import.meta.url).href
    );
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3); // 每个顶点的颜色
    for (let i = 0; i < params.count * 3; i++) {
      positions[i] = Math.random() * 10 - 5;
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
      //   color: 0xffff00,
      size: 0.2,
      map: texture,
      vertexColors: true, // 启用顶点着色
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // 混合模式
    });
    const points = new THREE.Points(particlesGeometry, material);
    scene?.add(points);
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(3, 3, 8);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    threeDemo.current?.appendChild(renderer.domElement);
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    scene.add(axesHelper);
    girdHelper = new THREE.GridHelper(10, 10);
    scene.add(girdHelper);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    createRandomPoint();
    const animate = () => {
      requestAnimationFrame(animate);
      controls?.update();
      renderer.render(scene!, camera!);
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

export default RandomPoints;
