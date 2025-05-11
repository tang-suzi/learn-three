import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CurvesAndTracks: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;

  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current?.parentNode.clientWidth /
        containerRef.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      containerRef.current?.parentNode.clientWidth,
      containerRef.current?.parentNode.clientHeight
    );
    containerRef.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  const createObjects = () => {
    // 根据点位创建曲线
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-2, 0, 2),
        new THREE.Vector3(-1, 1, 1),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(2, 0, 2),
      ],
      true
    ); // true表示闭合曲线

    // 计算曲线上的点
    // 这里的50是分割的次数，可以根据需要调整
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      createObjects();
      animate();
    }
  }, []);
  return <div ref={containerRef}></div>;
};

export default CurvesAndTracks;
