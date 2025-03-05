import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const WireframeGeometry: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const rgbeLoader = new RGBELoader();
    const hdrPath = new URL(
      "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
      import.meta.url
    ).href;
    rgbeLoader.load(hdrPath, (envMap) => {
      // 设置球形贴图
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      // 设置环境贴图
      scene.environment = envMap;
      scene.background = envMap;
    });
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      // 模型路径
      new URL("./../assets/model/building.glb", import.meta.url).href,
      // 加载完成回调
      (gltf) => {
        scene.add(gltf.scene);
        const building = gltf.scene.children[0];
        const geometry = building.geometry;
        // 获取边缘
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        // 创建线段材质
        const edgesMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
        });
        // 创建线段
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        scene.add(edges);
      }
    );
    const animate = () => {
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
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default WireframeGeometry;
