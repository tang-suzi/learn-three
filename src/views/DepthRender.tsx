import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const DepthRender: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.TextureLoader | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    textureLoader = new THREE.TextureLoader();
    const planeTexture = textureLoader.load(
      new URL("./../assets/texture/sprite0.png", import.meta.url).href
    );

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: planeTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    const planeTexture1 = textureLoader.load(
      new URL("./../assets/texture/lensflare0_alpha.png", import.meta.url).href
    );
    const planeGeometry1 = new THREE.PlaneGeometry(1, 1);
    const planeMaterial1 = new THREE.MeshBasicMaterial({
      map: planeTexture1,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);

    scene.add(plane);
    scene.add(plane1);
    plane1.position.set(0, 0, 1);
    plane1.renderOrder = 0;
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    // 创建gui文件夹
    const planeFolder = gui.addFolder("plane");
    planeFolder
      .add(plane.material, "depthFunc", {
        不写入: THREE.NeverDepth,
        总是写入: THREE.AlwaysDepth,
        小与: THREE.LessDepth,
        小于等于: THREE.LessEqualDepth,
        大于等于: THREE.GreaterEqualDepth,
        大于: THREE.GreaterDepth,
        不等于: THREE.NotEqualDepth,
      })
      .name("深度模式");
    planeFolder
      .add(plane.material, "depthWrite")
      .name("深度写入")
      .onChange(() => {
        plane.material.needsUpdate = true;
      });
    planeFolder
      .add(plane.material, "depthTest")
      .name("深度测试")
      .onChange(() => {
        plane.material.needsUpdate = true;
      });
    planeFolder.add(plane, "renderOrder", 0, 10).step(1).name("渲染顺序");

    const planeFolder1 = gui.addFolder("plane1");
    planeFolder1
      .add(plane1.material, "depthFunc", {
        不写入: THREE.NeverDepth,
        总是写入: THREE.AlwaysDepth,
        小与: THREE.LessDepth,
        小于等于: THREE.LessEqualDepth,
        大于等于: THREE.GreaterEqualDepth,
        大于: THREE.GreaterDepth,
        不等于: THREE.NotEqualDepth,
      })
      .name("深度模式");
    planeFolder1
      .add(plane1.material, "depthWrite")
      .name("深度写入")
      .onChange(() => {
        plane1.material.needsUpdate = true;
      });
    planeFolder1
      .add(plane1.material, "depthTest")
      .name("深度测试")
      .onChange(() => {
        plane1.material.needsUpdate = true;
      });
    planeFolder1.add(plane1, "renderOrder", 0, 10).step(1).name("渲染顺序");

    // rgbeLoader 加载hdr贴图
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        // 设置球形贴图
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 设置环境贴图
        scene.background = envMap;
        // 设置环境贴图
        scene.environment = envMap;
      }
    );

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const animate = () => {
      requestAnimationFrame(animate);
      controls?.update();
      renderer?.render(scene!, camera!);
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

export default DepthRender;
