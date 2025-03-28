import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const AnimationMixer: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let gridHelper: THREE.GridHelper | null = null;
  let rgbeLoader: RGBELoader | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  let gui: GUI | null = null;
  const clock: THREE.Clock = new THREE.Clock();
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(3, 3, 8);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    scene.add(axesHelper);
    gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        scene.background = new THREE.Color(0xcccccc);
        scene.environment = envMap;
      }
    );
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
        const clip = new THREE.AnimationClip("opactiy", 4, [opacityKF]);
        const action = mixer.clipAction(clip);
        action.play();

        gui = new GUI();
        gui.domElement.style.position = "absolute";
        threeDemo.current?.appendChild(gui.domElement);
        gui.add(mixer, "timeScale", 0, 5).name("动画时间缩放"); // 时间缩放
        gui
          .add(
            {
              stop: () => {
                mixer.stopAllAction(); // 停止所有动画
              },
            },
            "stop"
          )
          .name("停止动画"); // 停止动画
        gui
          .add(
            {
              play: () => {
                action.play();
                mixer.setTime(2); // 设置时间 时间要设置在play后面
              },
            },
            "play"
          )
          .name("播放动画");
      }
    );
    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      requestAnimationFrame(animate);
      controls?.update();
      renderer?.render(scene, camera);
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

export default AnimationMixer;
