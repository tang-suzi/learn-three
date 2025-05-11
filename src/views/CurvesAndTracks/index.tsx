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
  let moonMesh: THREE.Mesh | null = null;
  let curve: THREE.CatmullRomCurve3 | null = null;
  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();
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
    const elapsed = clock.getElapsedTime();
    if (moonMesh && curve) {
      //   const points = curve.getPoints(50);
      //   const pointIndex = Math.floor(((elapsed % 5) / 5) * points.length); // 计算当前点位索引
      //   moonMesh.position.copy(points[pointIndex]); // 更新小球位置
      const time = (elapsed * 0.1) % 1; // 计算当前时间
      const point = curve.getPointAt(time);
      //   moonMesh.position.copy(point); // 更新小球位置
      camera.position.copy(point); // 让相机根据轨迹移动
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  const createObjects = () => {
    // 根据点位创建曲线
    curve = new THREE.CatmullRomCurve3(
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

    const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load(
        new URL("./../../assets/texture/planets/moon_1024.jpg", import.meta.url)
          .href
      ),
    });
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moonMesh);
  };
  const createLight = () => {
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 0, 1);
    dirLight.layers.enableAll();
    scene.add(dirLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      createLight();
      createObjects();
      animate();
    }
  }, []);
  return <div ref={containerRef}></div>;
};

export default CurvesAndTracks;
