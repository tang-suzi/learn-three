import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Geometrys: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const init = () => {
    if (hasInit.current) return;
    hasInit.current = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);

    // 线条
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const linePoints = [];
    linePoints.push(new THREE.Vector3(-1, 0, 0));
    linePoints.push(new THREE.Vector3(0, 1, 0));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // 三角形
    const triangleGeometry = new THREE.BufferGeometry();
    const triangleVertices = new Float32Array([-1, 0, 0, 1, 0, 0, 0, 1, 0]);
    triangleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(triangleVertices, 3)
    );
    const triangleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // wireframe: true,
      side: THREE.DoubleSide, // 两面都可以看到
    });
    const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangle.position.set(2, 1, 2);
    scene.add(triangle);

    // 四边形
    const squareGeometry = new THREE.BufferGeometry();
    // const squareVertices = new Float32Array([
    //   -1, -1, 0, 1, -1, 0, 1, 1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0,
    // ]);
    const squareVertices = new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0,
    ]);
    squareGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(squareVertices, 3)
    );
    // 三角形的顶点索引
    // squareGeometry.setIndex([0, 1, 2, 0, 2, 3]);
    const indices = new Uint8Array([0, 1, 2, 2, 3, 0]);
    squareGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    const squareMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // wireframe: true,
      side: THREE.DoubleSide, // 两面都可以看到
    });
    const square = new THREE.Mesh(squareGeometry, squareMaterial);
    square.position.set(-2, 1, 2);
    scene.add(square);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div ref={threeDemo} style={{ width: "400px", height: "400px" }}></div>
  );
};

export default Geometrys;
