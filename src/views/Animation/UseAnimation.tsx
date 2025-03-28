import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const UseAnimation: FC = () => {
  const threeRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null; // 场景
  let camera: THREE.PerspectiveCamera | null = null; // 相机
  let renderer: THREE.WebGLRenderer | null = null; // 渲染器
  let controls: OrbitControls | null = null; // 控制器
  let axesHelper: THREE.AxesHelper | null = null; // 坐标轴
  let gridHelper: THREE.GridHelper | null = null; // 网格辅助器
  let gltfLoader: GLTFLoader | null = null; // gltf 模型加载器
  let dracoLoader: DRACOLoader | null = null; // draco 加载器
  let rgbeLoader: RGBELoader | null = null; // rgbe 加载器
  let mixer: THREE.AnimationMixer; // 动画混合器
  let walkAction, runAction, posAction, greetAction, idleAction; // 动作
  let currentAction: THREE.AnimationAction | null = null; // 当前动作
  const clock = new THREE.Clock(); // 时钟
  let gui: GUI | null = null; // GUI
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
  const createDRACOLoader = () => {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
  };
  const createGLTFLoader = () => {
    gltfLoader = new GLTFLoader();
    createDRACOLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      new URL("./../../assets/model/hilda_regular_00.glb", import.meta.url)
        .href,
      (gltf) => {
        console.log(gltf)
        const girl = gltf.scene;
        scene.add(girl);
        mixer = new THREE.AnimationMixer(girl);
        walkAction = mixer.clipAction(gltf.animations[37]);
        runAction = mixer.clipAction(gltf.animations[27]);
        posAction = mixer.clipAction(gltf.animations[23]);
        greetAction = mixer.clipAction(gltf.animations[0]);
        idleAction = mixer.clipAction(gltf.animations[6]);
        currentAction = idleAction;
        currentAction.play();
        initGUI();
      }
    );
  };
  const initGUI = () => {
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeRef.current?.appendChild(gui.domElement);

    const eventObj = {
      stopAll: () => {
        mixer.stopAllAction();
      },
      play: () => {
        if (currentAction) {
          currentAction.play();
        }
      },
      playWalk: () => {
        walkAction.enabled = true;
        walkAction.setEffectiveTimeScale(1);
        walkAction.setEffectiveWeight(1);
        walkAction.play();
        currentAction.crossFadeTo(walkAction, 0.5, true);
        currentAction = walkAction;
      },
      playRun: () => {
        runAction.enabled = true;
        runAction.setEffectiveTimeScale(1); // 设置时间缩放
        runAction.setEffectiveWeight(1); // 设置权重
        runAction.play();
        currentAction.crossFadeTo(runAction, 0.5, true); // 交叉淡入
        currentAction = runAction;
      },
      playPos: () => {
        posAction.enabled = true;
        posAction.setEffectiveTimeScale(1);
        posAction.setEffectiveWeight(1);
        posAction.play();
        currentAction.crossFadeTo(posAction, 0.5, true);
        currentAction = posAction;
      },
      playGreet: () => {
        greetAction.enabled = true;
        greetAction.setEffectiveTimeScale(1);
        greetAction.setEffectiveWeight(1);
        greetAction.play();
        currentAction.crossFadeTo(greetAction, 0.5, true);
        currentAction = greetAction;
      },
      playIdle: () => {
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1);
        idleAction.setEffectiveWeight(1);
        idleAction.play();
        currentAction.crossFadeTo(idleAction, 0.5, true);
        currentAction = idleAction;
      },
    };
    console.log(mixer);
    gui.add(mixer, "timeScale");
    gui.add(eventObj, "stopAll").name("停止所有动作");
    gui.add(eventObj, "play").name("播放当前动作");

    gui.add(eventObj, "playWalk").name("播放走路动作");
    gui.add(eventObj, "playRun").name("播放跑步动作");
    gui.add(eventObj, "playPos").name("播放撒娇动作");
    gui.add(eventObj, "playGreet").name("播放打招呼动作");
    gui.add(eventObj, "playIdle").name("播放待机动作");
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(3, 3, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    threeRef.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    scene.add(axesHelper);
    gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    createRGBELoader();
    createGLTFLoader();
    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta()); // 更新混合器
      }
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
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
      ref={threeRef}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default UseAnimation;
