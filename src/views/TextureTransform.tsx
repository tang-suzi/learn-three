import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const TextureTransform: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.TextureLoader | null = null;
  let gui: GUI | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../assets/texture/amber/base_color.jpg", import.meta.url).href
    );
    console.log(texture);
    texture.repeat.set(4, 4); // 设置重复次数
    /**
     * wrapS和wrapT的属性
     * THREE.RepeatWrapping // 重复
     * THREE.ClampToEdgeWrapping // 默认值，会拉伸元素
     * THREE.MirroredRepeatWrapping // 镜像重复
     */
    texture.wrapS = THREE.RepeatWrapping; // 纹理水平重复
    texture.wrapT = THREE.RepeatWrapping; // 纹理垂直重复
    // texture.offset.set(0.5, 0.5); // 纹理偏移
    texture.center.set(0.5, 0.5); // 纹理旋转中心点 默认0, 0
    texture.rotation = Math.PI / 2; // 旋转角度

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    const texture1 = textureLoader.load(
      new URL("./../assets/texture/rain.png", import.meta.url).href
    );
    texture1.flipY = true; // 纵向翻转，默认为翻转true
    const planeGeometry1 = new THREE.PlaneGeometry(1, 1);
    const planeMaterial1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture1,
      transparent: true,
    });
    const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
    plane1.position.set(2, 0, 0);
    scene.add(plane1);
    scene.background = new THREE.Color(0xffffff);
    gui
      .add(texture1, "premultiplyAlpha")
      .name("预乘Alpha")
      .onChange(() => {
        texture1.needsUpdate = true;
      });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  useEffect(() => {
    if (!hasInit.current) {
      init();
      hasInit.current = true;
    }
  }, []);
  return (
    <div
      ref={threeDemo}
      style={{ width: "400px", height: "400px", position: "relative" }}
    ></div>
  );
};

export default TextureTransform;
