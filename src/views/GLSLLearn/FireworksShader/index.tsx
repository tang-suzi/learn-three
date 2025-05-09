import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Water } from "three/examples/jsm/objects/Water2";
import Firework from "./firewark";

const FireworksShader: FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let rgbeLoader: RGBELoader | null = null;
  const fireworks = [];
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.parentNode.clientWidth /
        canvasRef.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 20);
    renderer = new THREE.WebGLRenderer({ alpha: false });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.1;
    renderer.setSize(
      canvasRef.current?.parentNode.clientWidth,
      canvasRef.current?.parentNode.clientHeight
    );
    canvasRef.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    gltfLoader = new GLTFLoader();
    rgbeLoader = new RGBELoader();
  };
  const addListener = () => {
    window.addEventListener("click", createFireworks);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    fireworks.forEach((item, i) => {
      const type = item.update();
      if (type === "remove") {
        fireworks.splice(i, 1);
      }
    });
    controls.update();
    renderer.render(scene, camera);
  };
  const loadTexture = () => {
    rgbeLoader?.load(
      new URL("./../../../assets/texture/2k.hdr", import.meta.url).href,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        // scene.background = texture;
        scene.environment = texture;
      }
    );
    gltfLoader.load(
      new URL("./../../../assets/texture/newyears_min.glb", import.meta.url)
        .href,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        const waterGeometry = new THREE.PlaneGeometry(100, 100);
        const water = new Water(waterGeometry, {
          scale: 4,
          textureHeight: 1024,
          textureWidth: 1024,
        });
        water.position.y = 1;
        water.rotation.x = -Math.PI / 2;
        scene.add(water);
      }
    );
  };
  const createFireworks = () => {
    const color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;

    const position = {
      x: Math.random() * 40 - 20,
      y: 7 + Math.random() * 40,
      z: -(Math.random() * 40 - 20),
    };
    const firework = new Firework({ color, to: position });
    firework.addScene(scene);
    fireworks.push(firework);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      loadTexture();
      addListener();
      animate();
    }
  }, []);
  return <div ref={canvasRef} style={{ position: "relative" }}></div>;
};

export default FireworksShader;
