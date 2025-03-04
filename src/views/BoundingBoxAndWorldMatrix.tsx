import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const BoundingBoxAndWorldMatrix: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    threeDemo.current?.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      }
    );
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      new URL("./../assets/model/Duck.glb", import.meta.url).href,
      (gltf) => {
        const duck = gltf.scene;
        scene.add(duck);
        // 通过物体名称查找元素，拿到geometry属性计算包围盒
        const duckMesh = gltf.scene.getObjectByName("LOD3spShape");
        const duckGeometry = duckMesh?.geometry;
        duckGeometry.computeBoundingBox();
        // 更新世界矩阵
        duckMesh.updateWorldMatrix(true, true);
        const duckBox = duckGeometry.boundingBox;
        duckBox.applyMatrix4(duckMesh.matrixWorld);
        const boxHelper = new THREE.Box3Helper(duckBox, 0xffff00);
        scene.add(boxHelper);
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

export default BoundingBoxAndWorldMatrix;
