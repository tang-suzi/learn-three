import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import pointVertexShader from "./pointVertex.glsl?raw";
import pointFragmentShader from "./pointFragment.glsl?raw";

const useShaderCreateParticles: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gui: GUI | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0.1, 0.1, 2);
    camera.aspect =
      threeDemo.current?.parentNode.clientWidth /
      threeDemo.current?.parentNode.clientHeight;
    camera.updateProjectionMatrix();
    // renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
  };
  const createPoint = () => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../../assets/texture/particles/10.png", import.meta.url)
        .href
    );

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([0, 0, 0]);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // const material = new THREE.PointsMaterial({
    //   color: 0xff0000,
    //   size: 10,
    //   sizeAttenuation: true,
    // });
    const material = new THREE.ShaderMaterial({
      vertexShader: pointVertexShader,
      fragmentShader: pointFragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: texture },
      },
    });
    const point = new THREE.Points(geometry, material);
    scene?.add(point);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  };
  useEffect(() => {
    if (!hasInit.current) {
      init();
      createPoint();
      hasInit.current = true;
    }
    animate();
  }, []);
  return <div ref={threeDemo} style={{ position: "relative" }}></div>;
};

export default useShaderCreateParticles;
