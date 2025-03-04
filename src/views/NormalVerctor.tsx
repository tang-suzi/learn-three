import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import texture from "./../assets/texture/uv_grid_opengl.jpg";

const NormalVerctor: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    camera.lookAt(0, 0, 0);
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
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    // 加载hdr贴图
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 环境贴图
        scene.background = envMap;
        scene.environment = envMap;
        // 环境贴图平面
        planeMaterial.envMap = envMap;
        // 环境贴图平面
        material.envMap = envMap;
      }
    );
    // 创建纹理
    const uvTexture = new THREE.TextureLoader().load(texture);
    // 创建平面几何体
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    // 创建材质
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: uvTexture,
    });
    // 创建平面
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // 添加到场景
    scene.add(planeMesh);
    planeMesh.position.x = -3;

    const vertices = new Float32Array([
      -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
    ]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const indices = new Uint8Array([0, 1, 2, 2, 3, 0]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

    const normals = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1, // 正面
    ]);
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    console.log(geometry);
    const material = new THREE.MeshBasicMaterial({
      map: uvTexture,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.position.x = 3;

    // 法向量辅助器
    const normalHelper = new VertexNormalsHelper(plane, 0.2, 0xff0000);
    scene.add(normalHelper);

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
export default NormalVerctor;
