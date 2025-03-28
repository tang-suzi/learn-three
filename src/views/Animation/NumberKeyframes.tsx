import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const NumberKeyframes: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let rgbeLoader: RGBELoader | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  const clock: THREE.Clock = new THREE.Clock();
  const createRGBELoader = () => {
    rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        // 设置球形贴图
        envMap.mapping = THREE.EquirectangularRefractionMapping; // 折射映射
        // // 设置环境贴图
        scene.background = new THREE.Color(0xcccccc);
        // // 设置环境贴图
        scene.environment = envMap;
      }
    );
  };
  const createGLTFLoader = () => {
    gltfLoader = new GLTFLoader();
    gltfLoader.load(
      new URL("./../../assets/model/moon.glb", import.meta.url).href,
      (gltf) => {
        scene.add(gltf.scene);
        const moon = gltf.scene.getObjectByName("defaultMaterial");
        moon.material.transparent = true;
        mixer = new THREE.AnimationMixer(gltf.scene);
        const opacityKF = new THREE.NumberKeyframeTrack(
          "defaultMaterial.material.opacity",
          [0, 1, 2, 3, 4],
          [1, 0.5, 0, 0.5, 1]
        );

        const positionZKF = new THREE.VectorKeyframeTrack(
          "defaultMaterial.position",
          [0, 2, 4],
          [0, 0, 0, 0, 2, 0, 0, 0, 0]
        );

        const clip = new THREE.AnimationClip("opacity", 4, [
          opacityKF,
          positionZKF,
        ]);
        const action = mixer.clipAction(clip);
        action.play();
      }
    );
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(3, 3, 8);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    scene.add(axesHelper);
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    createRGBELoader();
    createGLTFLoader();
    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    if (!hasInit.current) {
      init();
      hasInit.current = true;
    }
  }, []);
  return (
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default NumberKeyframes;
