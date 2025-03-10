import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const PlaceObjects: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let dracoLoader: DRACOLoader | null = null;
  let transformControls: TransformControls | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let gridHelper: THREE.GridHelper | null = null;
  let gui: GUI | null = null;
  let basicScene: THREE.Scene | null = null;
  const basicSceneMesh = new Map<string, THREE.Group>();
  let meshesFolder: GUI.Folder | null = null;
  const meshList = {
    盆栽: "./../assets/texture/model/house/plants-min.glb",
    沙发: "./../assets/texture/model/house/sofa_chair_min.glb",
  };
  let renderScene = null;
  const loadMesh = (name: string): Promise<THREE.Group> => {
    return new Promise((resolve, reject) => {
      gltfLoader?.load(
        new URL(meshList[name as keyof typeof meshList], import.meta.url).href,
        (gltf) => {
          const mesh = gltf.scene;
          mesh.name = `${name}-${new Date().getTime()}`;
          basicSceneMesh.set(mesh.name, mesh); // 存入 Map
          resolve(mesh); // 加载完成后返回模型
        },
        undefined,
        (error) => reject(error)
      );
    });
  };
  const initGUI = () => {
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    const eventObj = {
      showAxesHelper: () => {
        if (axesHelper) {
          scene?.remove(axesHelper);
          scene?.add(axesHelper);
        }
      },
      showGridHelper: () => {
        if (gridHelper) {
          scene?.remove(gridHelper);
          scene?.add(gridHelper);
        }
      },
      addScene: () => {
        if (basicScene) {
          scene.remove(basicScene as THREE.Object3D);
          scene.add(basicScene as THREE.Object3D);
        }
      },
      addPlant: async () => {
        const { name } = await loadMesh("盆栽");
        console.log(basicSceneMesh);
        if (basicSceneMesh.get(name)) {
          scene?.add(basicSceneMesh.get(name) as THREE.Object3D);
          transformControlsSelect(basicSceneMesh.get(name) as THREE.Group);
          meshesFolder
            .add(
              {
                toggleMesh: () => {
                  transformControlsSelect(basicSceneMesh.get(name));
                },
              },
              "toggleMesh"
            )
            .name(name);
        }
      },
      addSofa: async () => {
        const { name } = await loadMesh("沙发");
        if (basicSceneMesh.get(name)) {
          scene?.add(basicSceneMesh.get(name) as THREE.Object3D);
          transformControlsSelect(basicSceneMesh.get(name) as THREE.Group);
          meshesFolder
            .add(
              {
                toggleMesh: () => {
                  transformControlsSelect(basicSceneMesh.get(name));
                },
              },
              "toggleMesh"
            )
            .name(name);
        }
      },
    };
    gui.add(eventObj, "showGridHelper").name("添加网格");
    gui.add(eventObj, "showAxesHelper").name("添加坐标轴");
    gui.add(eventObj, "addScene").name("添加房间模型");
    const folder = gui.addFolder("添加物体");
    folder.add(eventObj, "addPlant").name("添加盆栽");
    folder.add(eventObj, "addSofa").name("添加沙发");
    meshesFolder = gui.addFolder("场景物体");

    const transformMode = {
      setTranslate: () => {
        transformControls.setMode("translate");
      },
      setRotate: () => {
        transformControls.setMode("rotate");
      },
      setScale: () => {
        transformControls.setMode("scale");
      },
      toggleSpace: function () {
        transformControls.setSpace(
          transformControls.space === "local" ? "world" : "local"
        );
      },
      cancelSelect: function () {
        transformControls.detach();
      },
    };
    const transformFolder = gui.addFolder("物体操作");
    transformFolder.add(transformMode, "setTranslate").name("平移");
    transformFolder.add(transformMode, "setRotate").name("旋转");
    transformFolder.add(transformMode, "setScale").name("缩放");
    transformFolder.add(transformMode, "toggleSpace").name("切换空间");
    transformFolder.add(transformMode, "cancelSelect").name("取消选择");

    window?.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "t":
          transformControls.setMode("translate");
          break;
        case "r":
          transformControls.setMode("rotate");
          break;
        case "s":
          transformControls.setMode("scale");
          break;
        default:
          return;
      }
    });
  };
  const initTransformControls = () => {
    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener("change", renderScene);
    // 拖动物体时禁用轨道控制器
    transformControls.addEventListener("dragging-changed", (event) => {
      controls.enabled = !event.value; // 禁用轨道控制器
    });
  };
  const transformControlsSelect = (mesh) => {
    transformControls.attach(mesh);
    const transformControlsHelper = transformControls.getHelper();
    scene?.add(transformControlsHelper);
  };
  const init = () => {
    initGUI();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x999999);
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(3, 3, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.antialias = true;
    renderer.logarithmicDepthBuffer = true;
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    gltfLoader = new GLTFLoader();
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    gltfLoader.load(
      new URL(
        "./../assets/texture/model/house/house-scene-min.glb",
        import.meta.url
      ).href,
      (gltf) => {
        basicScene = gltf.scene;
      }
    );
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    scene.add(axesHelper);
    gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.renderOrder = -1;
    scene.add(gridHelper);
    threeDemo.current?.appendChild(gui.domElement);
    renderScene = () => {
      requestAnimationFrame(renderScene);
      controls?.update();
      renderer?.render(scene as THREE.Scene, camera as THREE.Camera);
    };
    renderScene();
    initTransformControls();
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
export default PlaceObjects;
