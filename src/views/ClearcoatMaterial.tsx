import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const ClearcoatMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
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
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const rgbeLoader = new RGBELoader();

    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = envMap;
        scene.environment = envMap;
      }
    );

    const thicknessMap = new THREE.TextureLoader().load(
      new URL(
        "./../assets/texture/diamond/diamond_emissive.png",
        import.meta.url
      ).href
    );
    const scratchNormal = new THREE.TextureLoader().load(
      new URL(
        "./../assets/texture/carbon/Scratched_gold_01_1K_Normal.png",
        import.meta.url
      ).href
    );
    const carbonNormal = new THREE.TextureLoader().load(
      new URL("./../assets/texture/carbon/Carbon_Normal.png", import.meta.url)
        .href
    );

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      transparent: true,
      color: 0xffff00,
      clearcoat: 1,
      clearcoatRoughness: 0.01, // 粗糙度
      //   clearcoatMap: thicknessMap, // 清漆纹理
      //   clearcoatRoughnessMap: thicknessMap, // 清漆粗糙度纹理，与粗糙度属性配合
      clearcoatNormalMap: scratchNormal, // 清漆法线纹理
      normalMap: carbonNormal, // 法线贴图
      clearcoatNormalScale: new THREE.Vector2(1, 0.1), // 清漆法线涂层透明比例
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

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

export default ClearcoatMaterial;
