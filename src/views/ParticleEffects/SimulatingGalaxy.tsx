import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SimulatingGalaxy: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let girdHelper: THREE.GridHelper | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.Texture | null = null;
  //   const clock: THREE.Clock = new THREE.Clock();
  const params = {
    count: 3000,
    size: 0.1,
    radius: 5,
    branch: 3,
    color: "#ffae23",
    rotateScale: 0.3,
    endColor: "#1b315e",
  };
  let geometry = null;
  let material = null;
  const createStars = () => {
    textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../assets/texture/particles/1.png", import.meta.url).href
    );
    geometry = new THREE.BufferGeometry();
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
        Math.cos(branchAngel + distance * params.rotateScale) * distance +
        randomX;
      positions[current + 1] =
        Math.sin(branchAngel + distance * params.rotateScale) * distance +
        randomY;
      positions[current + 2] = 0 + randomZ;
      colors[i] = Math.random();
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    material = new THREE.PointsMaterial({
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
    scene.add(points);
    return points;
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.set(3, 3, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    threeDemo.current?.appendChild(renderer.domElement);

    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    girdHelper = new THREE.GridHelper(10, 10);
    scene.add(axesHelper);
    scene.add(girdHelper);
    const points = createStars();
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

export default SimulatingGalaxy;
