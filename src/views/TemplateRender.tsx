import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const TemplateRender: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  //   let controls: any | null = null;
  const init = () => {
    scene = new THREE.Scene();

    // 创建相机
    camera = new THREE.PerspectiveCamera(
      45, // 视角
      1, // 宽高比
      0.1, // 近平面
      1000 // 远平面
    );

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true, // 开启抗锯齿
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);

    // 设置相机位置
    camera.position.z = 40;
    camera.position.y = 4;
    camera.position.x = 2;
    camera.lookAt(0, 0, 0);

    // 添加世界坐标辅助器
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置带阻尼的惯性
    controls.enableDamping = true;
    // 设置阻尼系数
    controls.dampingFactor = 0.05;
    // 设置旋转速度
    // controls.autoRotate = true;

    // 渲染函数
    function animate() {
      controls.update();
      requestAnimationFrame(animate);
      // 渲染
      renderer.render(scene, camera);
    }
    animate();

    // rgbeLoader 加载hdr贴图
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      new URL(
        "./../assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
        import.meta.url
      ).href,
      (envMap) => {
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        scene.background = envMap;
        scene.environment = envMap;
      }
    );

    // 创建1个平面

    // 1、2个物体都设置模板缓冲区的写入和测试
    // 2、设置模板缓冲的基准值
    // 3、设置允许写入的掩码0xff
    // 4、在小球上设置模板比较函数THREE.EqualStencilFunc
    // 5、设置当函数比较通过时候，设置为replace替换
    const plane = new THREE.PlaneGeometry(8, 8);
    const planeMaterial = new THREE.MeshPhysicalMaterial({
      stencilWrite: true, //
      stencilWriteMask: 0xff, //0-255
      stencilRef: 2,
      stencilZPass: THREE.ReplaceStencilOp,
    });
    const planeMesh = new THREE.Mesh(plane, planeMaterial);
    scene.add(planeMesh);

    // 创建1个球
    const sphere = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffcccc,
      stencilWrite: true,
      stencilRef: 2,
      stencilFunc: THREE.EqualStencilFunc,
      depthTest: false,
    });
    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    sphereMesh.position.z = -10;
    scene.add(sphereMesh);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
    }
  }, []);
  return (
    <div ref={threeDemo} style={{ width: "400px", height: "400px" }}></div>
  );
};

export default TemplateRender;
