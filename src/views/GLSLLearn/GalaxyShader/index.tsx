import { FC, useRef, useEffect, use } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import vertexShader from "./vertex.glsl?raw";
import fragmentShader from "./fragment.glsl?raw";

const GalaxyShader: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gui: GUI | null = null;
  const clock: THREE.Clock = new THREE.Clock();
  let material: THREE.PointsMaterial | THREE.ShaderMaterial | null = null;

  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0.2, 0.2, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    threeDemo.current?.appendChild(renderer.domElement);
  };
  const animate = () => {
    const time = clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  const createGalaxy = () => {
    const params = {
      count: 1000,
      size: 0.1,
      radius: 5,
      branches: 4,
      spin: 0.5,
      color: "#ff6030",
      outColor: "#1b3984",
    };
    const galaxyColor = new THREE.Color(params.color);
    const outGalaxyColor = new THREE.Color(params.outColor);
    let geometry: THREE.BufferGeometry | null = null;
    let points: THREE.Points | null = null;
    const generateGalaxy = () => {
      const textureLoader = new THREE.TextureLoader();
      const particleTexture = textureLoader.load(
        new URL("./../../../assets/texture/particles/10.png", import.meta.url)
          .href
      );
      const texture1 = textureLoader.load(
        new URL("./../../../assets/texture/particles/9.png", import.meta.url)
          .href
      );
      const texture2 = textureLoader.load(
        new URL("./../../../assets/texture/particles/11.png", import.meta.url)
          .href
      );
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene?.remove(points);
      }
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(params.count * 3);
      const colors = new Float32Array(params.count * 3);
      const scales = new Float32Array(params.count);
      const imgIndex = new Float32Array(params.count);
      for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;
        const branchAngel =
          (i % params.branches) * ((Math.PI * 2) / params.branches);
        const radius = Math.random() * params.radius;
        const randomX =
          Math.pow(Math.random() * 2 - 1, 3) *
          0.5 *
          (params.radius - radius) *
          0.3;
        const randomY =
          Math.pow(Math.random() * 2 - 1, 3) *
          0.5 *
          (params.radius - radius) *
          0.3;
        const randomZ =
          Math.pow(Math.random() * 2 - 1, 3) *
          0.5 *
          (params.radius - radius) *
          0.3;
        positions[i3] = Math.cos(branchAngel) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngel) * radius + randomZ;
        const mixColor = galaxyColor.clone();
        mixColor.lerp(outGalaxyColor, radius / params.radius);
        colors[i3] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;
        scales[i3] = Math.random();
        imgIndex[i3] = i % 3;
      }
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute(
        "imgIndex",
        new THREE.BufferAttribute(imgIndex, 1)
      );

      // material = new THREE.PointsMaterial({
      //   color: new THREE.Color(params.color),
      //   size: params.size,
      //   sizeAttenuation: true,
      //   depthWrite: false,
      //   blending: THREE.AdditiveBlending,
      //   map: particleTexture,
      //   alphaMap: particleTexture,
      //   transparent: true,
      //   vertexColors: true,
      // });
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: particleTexture },
          uTexture1: { value: texture1 },
          uTexture2: { value: texture2 },
          uColor: { value: galaxyColor },
        },
      });
      points = new THREE.Points(geometry, material);
      scene?.add(points);
    };
    generateGalaxy();
  };
  useEffect(() => {
    if (threeDemo.current && !hasInit.current) {
      hasInit.current = true;
      init();
      createGalaxy();
      animate();
    }
  }, []);
  return <div ref={threeDemo} style={{ position: "relative" }}></div>;
};

export default GalaxyShader;
