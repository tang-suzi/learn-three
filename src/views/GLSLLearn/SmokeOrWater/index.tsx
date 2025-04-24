import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import vertexShader from "./vertex.glsl?raw";
import fragmentShader from "./fragment.glsl?raw";

const SmokeOrWater: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let material: THREE.ShaderMaterial | null = null;
  let gui: GUI | null = null;
  let clock: THREE.Clock | null = null;
  const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0.1, 0.1, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    clock = new THREE.Clock();
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
  };
  const createObjects = () => {
    const params = {
      uWaresFrequency: 14.0, // 频率
      uScale: 0.03, // 缩放
      uNoiseFrequency: 10.0, // 噪声频率
      uNoiseScale: 2.0, // 噪声缩放
      uXzScale: 0.15, // xz缩放
      uLowColor: "#ff0000",
      uHighColor: "#ffff00",
      uXSpeed: 0.5,
      uZSpeed: 0.5,
      uNoiseSpeed: 0.5,
      uOpacity: 0.5,
    };
    const geometry = new THREE.PlaneGeometry(1, 1, 512, 512);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uWaresFrequency: {
          value: params.uWaresFrequency,
        },
        uScale: {
          value: params.uScale,
        },
        uNoiseFrequency: {
          value: params.uNoiseFrequency,
        },
        uNoiseScale: {
          value: params.uNoiseScale,
        },
        uXzScale: {
          value: params.uXzScale,
        },
        uTime: {
          value: params?.uTime,
        },
        uLowColor: {
          value: new THREE.Color(params.uLowColor),
        },
        uHighColor: {
          value: new THREE.Color(params.uHighColor),
        },
        uXSpeed: {
          value: params.uXSpeed,
        },
        uZSpeed: {
          value: params.uZSpeed,
        },
        uNoiseSpeed: {
          value: params.uNoiseSpeed,
        },
        uOpacity: {
          value: params.uOpacity,
        },
      },
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene?.add(plane);
    gui?.add(params, "uWaresFrequency", 1, 100, 0.1).onChange((value) => {
      material.uniforms.uWaresFrequency.value = value;
    });
    gui?.add(params, "uScale", 0, 0.2, 0.001).onChange((value) => {
      material.uniforms.uScale.value = value;
    });
    gui?.add(params, "uNoiseFrequency", 1, 100, 0.1).onChange((value) => {
      material.uniforms.uNoiseFrequency.value = value;
    });
    gui?.add(params, "uNoiseScale", 0, 5, 0.001).onChange((value) => {
      material.uniforms.uNoiseScale.value = value;
    });
    gui?.add(params, "uXzScale", 0, 5, 0.001).onChange((value) => {
      material.uniforms.uXzScale.value = value;
    });
    gui?.addColor(params, "uLowColor").onFinishChange((value) => {
      material.uniforms.uLowColor.value = new THREE.Color(value);
    });
    gui?.addColor(params, "uHighColor").onFinishChange((value) => {
      material.uniforms.uHighColor.value = new THREE.Color(value);
    });
    gui?.add(params, "uXSpeed", 0, 5, 0.01).onChange((value) => {
      material.uniforms.uXSpeed.value = value;
    });
    gui?.add(params, "uZSpeed", 0, 5, 0.01).onChange((value) => {
      material.uniforms.uZSpeed.value = value;
    });
    gui?.add(params, "uNoiseSpeed", 0, 5, 0.01).onChange((value) => {
      material.uniforms.uNoiseSpeed.value = value;
    });
    gui?.add(params, "uOpacity", 0, 1, 0.01).onChange((value) => {
      material.uniforms.uOpacity.value = value;
    });
  };
  const animate = () => {
    controls.update();
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  useEffect(() => {
    if (!hasInit.current) {
      init();
      createObjects();
      animate();
      hasInit.current = true;
    }
  }, []);
  return <div ref={threeDemo} style={{ position: "relative" }}></div>;
};

export default SmokeOrWater;
