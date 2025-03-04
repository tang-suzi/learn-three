import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import planeTexture from "./../assets/texture/uv_grid_opengl.jpg";

const UVPropSetting: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
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

    const planeTex = new THREE.TextureLoader().load(planeTexture);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ map: planeTex })
    );
    scene.add(plane);

    const geometry = new THREE.BufferGeometry();
    console.log(geometry);
    const vertices = new Float32Array([
      -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const indices = new Uint8Array([0, 1, 2, 2, 3, 0]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]); // uv是对应的纹理坐标
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const material = new THREE.MeshBasicMaterial({
      map: planeTex,
      color: 0xffff00,
    });
    const plane1 = new THREE.Mesh(geometry, material);
    scene.add(plane1);
    plane1.position.x = 3;

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
      style={{
        width: "400px",
        height: "400px",
        position: "relative",
      }}
    ></div>
  );
};

export default UVPropSetting;
