import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Water } from "three/examples/jsm/objects/Water2";

const ThreeJSWater: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let rgbeLoader: RGBELoader | null = null;
  let gltfLoader: GLTFLoader | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.aspect =
      threeDemo.current?.parentNode.clientWidth! /
      threeDemo.current?.parentNode.clientHeight!;
    camera.updateProjectionMatrix();
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    rgbeLoader = new RGBELoader();
    gltfLoader = new GLTFLoader();
  };
  const createObjects = () => {
    rgbeLoader
      .loadAsync(
        new URL("./../../../assets/texture/050.hdr", import.meta.url).href
      )
      .then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
      });
    gltfLoader.load(
      new URL("./../../../assets/texture/yugang.glb", import.meta.url).href,
      (gltf) => {
        const yugang = gltf.scene.children[0];
        yugang.material.side = THREE.DoubleSide;

        const waterGeometry = gltf.scene.children[1].geometry;
        const water = new Water(waterGeometry, {
          color: "#ffffff",
          scale: 1,
          flowDirection: new THREE.Vector2(1, 1),
          textureHeight: 1024,
          textureWidth: 1024,
        });
        yugang.add(water);
        scene.add(yugang);
      }
    );
  };
  const animate = () => {
    requestAnimationFrame(animate);
    controls?.update();
    renderer?.render(scene, camera);
  };
  useEffect(() => {
    if (!hasInit.current) {
      init();
      createObjects();
      animate();
      hasInit.current = true;
    }
  }, []);
  return <div ref={threeDemo} style={{ position: "relative" }}></div>;
};

export default ThreeJSWater;
