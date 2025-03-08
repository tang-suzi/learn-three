import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const RenderIceJuice: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gui: GUI | null = null;
  let rgbeLoader: RGBELoader | null = null;
  let dracoLoader: DRACOLoader | null = null;
  let gltfLoader: GLTFLoader | null = null;
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
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    gltfLoader = new GLTFLoader();
    rgbeLoader = new RGBELoader();
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene!.background = envMap;
        scene!.environment = envMap;
      }
    );

    gltfLoader.load(
      new URL("./../assets/texture/model/cup.glb", import.meta.url).href,
      (gltf) => {
        const cup = gltf.scene.getObjectByName("copo_low_01_vidro_0");
        const water = gltf.scene.getObjectByName("copo_low_02_agua_0");
        const ice = gltf.scene.getObjectByName("copo_low_04_vidro_0");
        console.log(cup);
        console.log(water);
        console.log(ice);
        // cup.visible = false;
        // water.visible = false;
        scene.add(gltf.scene);

        const iceMaterial = ice.material;
        ice.material = new THREE.MeshPhysicalMaterial({
          normalMap: iceMaterial.normalMap,
          metalnessMap: iceMaterial.metalnessMap,
          roughness: 0,
          color: 0xffffff,
          transparent: true,
          transmission: 0.95,
          thickness: 10,
          ior: 2,
          opacity: 0.5,
        });
        const waterMaterial = water.material;
        water.material = new THREE.MeshPhysicalMaterial({
          map: waterMaterial.map,
          normalMap: waterMaterial.normalMap,
          metalnessMap: waterMaterial.metalnessMap,
          roughnessMap: waterMaterial.roughnessMap,
          transparent: true,
          transmission: 0.95,
          roughness: 0.1,
          thickness: 10,
          ior: 2,
          //   opacity: 0.6,
        });

        const cupMaterial = cup.material;
        cup.material = new THREE.MeshPhysicalMaterial({
          map: cupMaterial.map,
          normalMap: cupMaterial.normalMap,
          metalnessMap: cupMaterial.metalnessMap,
          roughnessMap: cupMaterial.roughnessMap,
          transparent: true,
          transmission: 0.95,
          roughness: 0.3,
          thickness: 10,
          ior: 2,
          opacity: 0.5,
        });
      }
    );
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
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

export default RenderIceJuice;
