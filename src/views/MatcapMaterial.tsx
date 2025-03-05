import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MatcapMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 2, 10);
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      // 模型路径
      new URL("./../assets/model/Duck.glb", import.meta.url).href,
      // 加载完成回调
      (gltf) => {
        // const matcapTextureUrl = new URL(
        //   "./../assets/texture/matcaps/9.jpg",
        //   import.meta.url
        // ).href;
        const matcapTextureUrl = new URL(
          "./../assets/texture/matcaps/54584E_B1BAC5_818B91_A7ACA3-512px.png",
          import.meta.url
        ).href;
        scene.add(gltf.scene);
        const duckMesh = gltf.scene.getObjectByName("LOD3spShape");
        const matcapTexture = new THREE.TextureLoader().load(matcapTextureUrl);
        const preMaterial = duckMesh.material;
        duckMesh.material = new THREE.MeshMatcapMaterial({
          matcap: matcapTexture,
          map: preMaterial.map,
        });
      }
    );

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

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
    <div ref={threeDemo} style={{ width: "400px", height: "400px" }}></div>
  );
};

export default MatcapMaterial;
