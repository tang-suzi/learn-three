import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const UsePointMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let girdHelper: THREE.GridHelper | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.Texture | null = null;
  const createSphere = () => {
    textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../assets/texture/particles/2.png", import.meta.url).href
    );
    // 创建一个普通球体
    const geometry = new THREE.SphereGeometry(3, 30, 30);
    /**
     * PointsMaterial 默认使用 map 进行纹理映射，而 SphereGeometry 生成的 UV 坐标是为 Mesh 设计的，并不是专门用于 Points。
     * 删除 uv 后，PointsMaterial 仅会对每个顶点应用纹理，而不会尝试按 UV 坐标映射整个球体。
     * 这样每个点都会独立地使用 map 纹理，而不是按球体的 UV 贴图方式来分布纹理。
     */
    delete geometry.attributes.uv;
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   wireframe: true,
    // });
    // const sphere = new THREE.Mesh(geometry, material);
    // scene?.add(sphere);

    // 创建一个点
    const material = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 0.1,
      map: texture,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // 混合模式
    });

    const points = new THREE.Points(geometry, material);
    scene?.add(points);
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(3, 3, 8);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    threeDemo.current?.appendChild(renderer.domElement);
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    scene.add(axesHelper);
    girdHelper = new THREE.GridHelper(10, 10);
    scene.add(girdHelper);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    createSphere();
    const animate = () => {
      requestAnimationFrame(animate);
      controls?.update();
      renderer.render(scene!, camera!);
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

export default UsePointMaterial;
