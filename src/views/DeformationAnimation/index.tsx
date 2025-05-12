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
  const loadGltf = () => {
    gltfLoader.load(
      new URL("./../../assets/model/sphere1.glb", import.meta.url).href,
      (gltf) => {
        const model = gltf.scene;
        console.log(model.children[0]);
        scene.add(model);
        const sphere1 = model.children[0];
        gltfLoader.load(
          new URL("./../../assets/model/sphere2.glb", import.meta.url).href,
          (gltf1) => {
            sphere1.geometry.morphAttributes.position = [];
            sphere1.geometry.morphAttributes.position.push(
              gltf1.scene.children[0].geometry.attributes.position
            );
            sphere1.updateMorphTargets();
            sphere1.morphTargetInfluences[0] = 1;
            const params = { value: 0 };
            gsap.to(params, {
              value: 1,
              duration: 2,
              repeat: -1,
              yoyo: true,
              onUpdate: () => {
                sphere1.morphTargetInfluences[0] = params.value;
              },
            });
          }
        );
      }
    );
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
