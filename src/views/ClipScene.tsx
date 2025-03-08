import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const ClipScene: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  //   let controls: any | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 50);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const scene2 = new THREE.Scene();

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        // 设置球形贴图
        // envMap.mapping = THREE.EquirectangularReflectionMapping;
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        // 设置环境贴图
        scene.background = envMap;
        scene2.background = envMap;
        // 设置环境贴图
        scene.environment = envMap;
      }
    );

    const geometry1 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material1 = new THREE.MeshBasicMaterial({
      wireframe: true,
    });
    const torusKnot1 = new THREE.Mesh(geometry1, material1);
    scene2.add(torusKnot1);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    const param = {
      scissorWidth: threeDemo.current?.clientWidth / 2,
    };

    gui.add(param, "scissorWidth", 0, threeDemo.current?.clientWidth);
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      // 裁剪检测
      renderer.setScissorTest(true);
      renderer.setScissor(0, 0, param.scissorWidth, 400); // x、y、width、height
      renderer?.render(scene!, camera!);
      renderer.setScissor(
        param.scissorWidth,
        0,
        threeDemo.current?.clientWidth - param.scissorWidth,
        400
      );
      renderer?.render(scene2!, camera!);
      renderer.setScissorTest(false);
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

export default ClipScene;
