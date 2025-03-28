import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CreateKeyframes: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let ambientLight: THREE.AmbientLight | null = null;
  let gridHelper: THREE.GridHelper | null = null;
  let controls: OrbitControls | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let mixer;
  const clock = new THREE.Clock();
  const createCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "cube";
    scene?.add(cube);
    // 创建平移动画帧
    mixer = new THREE.AnimationMixer(cube);
    const positionKF = new THREE.VectorKeyframeTrack(
      "cube.position",
      [0, 1, 2, 3, 4],
      [0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0]
    );
    // console.log(mixer);

    // 创建旋转动画帧
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0); // 使用轴角旋转
    const quaternion1 = new THREE.Quaternion();
    quaternion1.setFromEuler(new THREE.Euler(Math.PI, 0, 0)); // 使用欧拉角旋转180度
    const quaternion2 = new THREE.Quaternion();
    quaternion2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const finalArr = [
      ...quaternion.toArray(),
      ...quaternion1.toArray(),
      ...quaternion2.toArray(),
    ];
    console.log(finalArr);
    const rotationKF = new THREE.QuaternionKeyframeTrack(
      "cube.quaternion",
      [0, 2, 4],
      finalArr
    );

    const clip = new THREE.AnimationClip("move", 4, [positionKF, rotationKF]);
    const action = mixer.clipAction(clip);
    // console.log(action);
    action.play();
  };
  const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(3, 3, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 400);
    threeDemo.current?.appendChild(renderer.domElement);
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    createCube();
    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
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

export default CreateKeyframes;
