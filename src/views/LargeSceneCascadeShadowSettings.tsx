import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSM } from "three/examples/jsm/csm/CSM.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

/**
 * 使用CSM级联阴影
 * 1. 添加设置参数
 * 2. 创建CSM对象
 * 3. 将物体材质添加级联阴影
 * 4. csm在请求动画帧中更新
 * 5. 灯光使用
 * 6. 删除平行光等光源阴影投射
 * 7. 将光源方向使用级联阴影方向
 * 8. 设置renderer.shadowMap.type使用软阴影弱化阴影的像素框
 */
const LargeSceneCascadeShadowSettings: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    // 设置渲染器允许投射阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    const params = {
      orthographic: false,
      fade: false,
      far: 1000,
      mode: "practical",
      lightX: 0,
      lightY: -1,
      lightZ: 0,
      margin: 100,
      lightFar: 1000,
      lightNear: 1,
      autoUpdateHelper: true,
      updateHelper: function () {
        csmHelper.update();
      },
    };

    const csm = new CSM({
      maxFar: params.far, // 最远距离
      cascades: 4, // 级联等级，越多越细
      mode: params.mode, // 模式
      parent: scene, // 级联阴影父级
      shadowMapSize: 1024, // 纹理阴影尺寸大小
      lightDirection: new THREE.Vector3( // 灯光方向
        params.lightX,
        params.lightY,
        params.lightZ
      ).normalize(),
      camera: camera, // 添加相机
    });
    csm.fade = true; // 是否淡入淡出
    csm.updateFrustums(); // 

    // 环境光 不能用来投射阴影，因为它没有方向。
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    // 平行光 可以投射阴影，灯光有范围
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(params.lightX, params.lightY, params.lightZ);
    directionalLight.position.normalize();
    directionalLight.position.multiplyScalar(-200);
    // 默认平行光的目标是原点
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material1 = new THREE.MeshPhysicalMaterial({
      color: 0xccccff,
    });
    csm.setupMaterial(material1);
    console.log(csm);
    const torusKnot = new THREE.Mesh(geometry, material1);
    torusKnot.position.set(4, 0, 0);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add(torusKnot);
    console.log(gui);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const material2 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
    });
    csm.setupMaterial(material2);
    const sphere = new THREE.Mesh(sphereGeometry, material2);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material3 = new THREE.MeshPhysicalMaterial({
      color: 0xffcccc,
    });
    csm.setupMaterial(material3);
    const box = new THREE.Mesh(boxGeometry, material3);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(-4, 0, 0);
    scene.add(box);

    const planeGeometry = new THREE.PlaneGeometry(24, 24, 1, 1);
    const planeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x999999,
    });
    csm.setupMaterial(planeMaterial);
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.set(0, -4, 0);
    // 平面接收阴影
    planeMesh.receiveShadow = true;
    planeMesh.castShadow = true;
    scene.add(planeMesh);

    gui.add(csm, "fade").onChange((value) => {
      csm.fade = value;
      csm.updateFrustums();
    });

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const render = () => {
      requestAnimationFrame(render);
      camera.updateMatrixWorld();
      csm.update();
      directionalLight.shadow.camera.updateProjectionMatrix();
      //   directionalLightHelper.update();
      controls?.update();
      renderer?.render(scene!, camera!);
    };
    render();
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

export default LargeSceneCascadeShadowSettings;
