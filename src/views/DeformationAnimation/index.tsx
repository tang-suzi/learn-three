import { FC, useRef, useEffect, use } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const DeformationAnimation: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let dracoLoader: DRACOLoader | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let rgbeLoader: RGBELoader | null = null;
  let gui: GUI | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.parentNode.clientWidth /
        containerRef.current.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      containerRef.current.parentNode.clientWidth,
      containerRef.current.parentNode.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    rgbeLoader = new RGBELoader();
    gui = new GUI();
  };
  const loadRgbe = () => {
    rgbeLoader.load(
      new URL("./../../assets/texture/038.hdr", import.meta.url).href,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
      }
    );
  };
  const loadGltf = async () => {
    // gltfLoader.load(
    //   new URL("./../../assets/model/sphere1.glb", import.meta.url).href,
    //   (gltf) => {
    //     const model = gltf.scene;
    //     scene.add(model);
    //     const sphere1 = model.children[0];
    //     gltfLoader.load(
    //       new URL("./../../assets/model/sphere2.glb", import.meta.url).href,
    //       (gltf1) => {
    //         sphere1.geometry.morphAttributes.position = [];
    //         sphere1.geometry.morphAttributes.position.push(
    //           gltf1.scene.children[0].geometry.attributes.position
    //         );
    //         sphere1.updateMorphTargets();
    //         sphere1.morphTargetInfluences[0] = 1;
    //         const params = { value: 0 };
    //         gsap.to(params, {
    //           value: 1,
    //           duration: 2,
    //           repeat: -1,
    //           yoyo: true,
    //           onUpdate: () => {
    //             sphere1.morphTargetInfluences[0] = params.value;
    //           },
    //         });
    //       }
    //     );
    //   }
    // );
    const params = { value0: 0, value1: 0 };
    let petal: THREE.Mesh = null;
    let petal1 = null;
    let petal2 = null;
    let stem: THREE.Mesh = null;
    let stem1 = null;
    let stem2 = null;
    const { scene: f4Scene } = await gltfLoader.loadAsync(
      new URL("./../../assets/model/f4.glb", import.meta.url).href
    );
    f4Scene.rotation.x = Math.PI;
    f4Scene.traverse((item) => {
      if (item.material && item.material.name === "Water") {
        item.material = new THREE.MeshStandardMaterial({
          color: "skyblue",
          depthWrite: false,
          depthTest: false,
          transparent: true,
          opacity: 0.7,
        });
      }
      if (item.material && item.material.name === "Stem") {
        stem = item;
      }
      if (item.material && item.material.name === "Petal") {
        petal = item;
      }
    });
    scene.add(f4Scene);
    const { scene: f2Scene } = await gltfLoader.loadAsync(
      new URL("./../../assets/model/f2.glb", import.meta.url).href
    );
    f2Scene.traverse((item) => {
      if (item.material && item.material.name === "Petal") {
        petal1 = item;
        if (!petal.geometry.morphAttributes.position) {
          petal.geometry.morphAttributes.position = [];
        }
        petal.geometry.morphAttributes.position.push(
          petal1.geometry.attributes.position
        );

        petal.updateMorphTargets();
        petal.morphTargetInfluences[0] = 1;
      }
      if (item.material && item.material.name === "Stem") {
        stem1 = item;
        if (!stem.geometry.morphAttributes.position) {
          stem.geometry.morphAttributes.position = [];
        }
        stem.geometry.morphAttributes.position.push(
          stem1.geometry.attributes.position
        );
        stem.updateMorphTargets();
        stem.morphTargetInfluences[0] = 1;
      }
      gsap.to(params, {
        value0: 1,
        duration: 4,
        delay: 0,
        onUpdate: () => {
          petal.morphTargetInfluences[0] = params.value0;
          stem.morphTargetInfluences[0] = params.value0;
        },
      });
    });
    const { scene: f1Scene } = await gltfLoader.loadAsync(
      new URL("./../../assets/model/f1.glb", import.meta.url).href
    );
    f1Scene.traverse((item) => {
      if (item.material && item.material.name === "Petal") {
        petal2 = item;
        petal.geometry.morphAttributes.position.push(
          petal2.geometry.attributes.position
        );
        petal.updateMorphTargets();
        petal.morphTargetInfluences[1] = 0;
      }
      if (item.material && item.material.name === "Stem") {
        stem2 = item;
        stem.geometry.morphAttributes.position.push(
          stem2.geometry.attributes.position
        );
        stem.updateMorphTargets();
        stem.morphTargetInfluences[1] = 0;
      }
      gsap.to(params, {
        value1: 1,
        duration: 4,
        delay: 3,
        onUpdate: function () {
          petal.morphTargetInfluences[0] = params.value0;
          stem.morphTargetInfluences[0] = params.value0;
          petal.morphTargetInfluences[1] = params.value1;
          stem.morphTargetInfluences[1] = params.value1;
        },
      });
    });
  };
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      loadRgbe();
      loadGltf();
      animate();
    }
  }, []);
  return <div ref={containerRef}></div>;
};

export default DeformationAnimation;
