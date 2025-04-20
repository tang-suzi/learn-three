import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import vertexShader from "./vertex.glsl?raw";
import fragmentShader from "./fragment.glsl?raw";

const KongmingLantern: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gltfLoader: GLTFLoader | null = null;

  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.2;
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.maxPolarAngle = Math.PI / 3 * 2;
    controls.minPolarAngle = Math.PI / 3 * 2;
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  const createObject = () => {
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {},
    });

    const rgbLoader = new RGBELoader();
    rgbLoader.load(
      new URL("./../../../assets/texture/2k.hdr", import.meta.url).href,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
      }
    );

    gltfLoader = new GLTFLoader();
    let lightBox = null;
    gltfLoader.load(
      new URL("./../../../assets/texture/model/flyLight.glb", import.meta.url)
        .href,
      (gltf) => {
        lightBox = gltf.scene.children[0];
        lightBox.material = shaderMaterial;
        for (let i = 0; i < 150; i++) {
          const flyLight = gltf.scene.clone(true);
          const x = (Math.random() - 0.5) * 200;
          const z = (Math.random() - 0.5) * 200;
          const y = Math.random() * 60 + 25;
          flyLight.position.set(x, y, z);
          gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 10 + Math.random() * 30,
            repeat: -1,
          });
          gsap.to(flyLight.position, {
            x: "+=" + Math.random() * 5,
            y: "+=" + Math.random() * 20,
            yoyo: true,
            duration: 5 + Math.random() * 10,
            repeat: -1,
          });
          scene.add(flyLight);
        }
      }
    );
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      createObject();
      animate();
    }
  }, []);
  return <div ref={threeDemo}></div>;
};
export default KongmingLantern;
