import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const AddAxesHelper: FC = () => {
  const addAxesHelperRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    if (hasInit.current) return;
    hasInit.current = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 2;
    camera.position.x = 1;
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      addAxesHelperRef.current?.clientWidth,
      addAxesHelperRef.current?.clientHeight
    );
    addAxesHelperRef.current?.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // 世界坐标辅助器
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 阻尼惯性
    controls.enableDamping = true;
    // 阻尼系数
    controls.dampingFactor = 0.02;
    // 旋转
    controls.autoRotate = true;
    // 旋转速度
    controls.autoRotateSpeed = 0.5;
    // 启用或禁用摄像机平移
    controls.enablePan = true;
    // 启用或禁用摄像头水平或垂直旋转
    controls.enableRotate = true;

    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div
      ref={addAxesHelperRef}
      style={{ width: "400px", height: "400px" }}
    ></div>
  );
};

export default AddAxesHelper;
