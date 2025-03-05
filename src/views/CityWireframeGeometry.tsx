import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const CityWireframeGeometry: FC = () => {
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

    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setDRACOLoader(dracoLoader);
    const cityGltfURL = new URL("./../assets/model/city.glb", import.meta.url)
      .href;
    gltfLoader.load(cityGltfURL, (gltf) => {
      //   scene.add(gltf.scene);
      gltf.scene.traverse((child) => {
        console.log(child);
        if (child instanceof THREE.Mesh) {
          //   child.material.wireframe = true; // 直接改为线框
          const building = child;
          const geometry = building.geometry;
          const edgesGeometry = new THREE.EdgesGeometry(geometry);
          //   const edgesGeometry = new THREE.WireframeGeometry(geometry);
          const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
          });
          const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
          // 更新建筑物世界转换矩阵
          building.updateWorldMatrix(true, true);
          edges.matrix.copy(building.matrixWorld);
          edges.matrix.decompose(edges.position, edges.quaternion, edges.scale);
          // 添加到场景
          scene.add(edges);
        }
      });
    });

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

export default CityWireframeGeometry;
