import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const RaycastingObjectInteraction: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let controls: OrbitControls | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let girdHelper: THREE.GridHelper | null = null;
  let cameraHelper: THREE.CameraHelper | null = null;
  const createCube = () => {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const cubeArr = [];
    for (let x = -5; x < 5; x++) {
      for (let y = -5; y < 5; y++) {
        for (let z = -5; z < 5; z++) {
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(x, y, z);
          scene?.add(cube);
          cubeArr.push(cube);
        }
      }
    }
    return cubeArr;
  };

  const createRaycaster = (mouse, cubeArr) => {
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera!);
    const result = raycaster.intersectObjects(cubeArr);
    console.log(result);
    if (result.length) {
      result.map((item) => {
        item.object.material = material;
      });
    }
  };

  const addListener = (cubeArr) => {
    const mouse = new THREE.Vector2();
    const boxPosition = threeDemo.current?.getBoundingClientRect();
    window.addEventListener("click", (event) => {
      if (event.target.tagName === "CANVAS") {
        mouse.x =
          ((event.clientX - boxPosition?.left) / boxPosition?.width) * 2 - 1;
        mouse.Y =
          -((event.clientY - boxPosition?.top) / boxPosition?.height) * 2 - 1;
        createRaycaster(mouse, cubeArr);
      }
    });
    // window.addEventListener("mousemove", (event) => {
    //   if (event.target.tagName === "CANVAS") {
    //     mouse.x =
    //       ((event.clientX - boxPosition?.left) / boxPosition?.width) * 2 - 1;
    //     mouse.Y =
    //       -((event.clientY - boxPosition?.top) / boxPosition?.height) * 2 - 1;
    //     createRaycaster(mouse, cubeArr);
    //   }
    // });
  };

  const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    threeDemo.current?.appendChild(renderer.domElement);
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    girdHelper = new THREE.GridHelper(10, 10);
    cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);
    scene.add(axesHelper);
    scene.add(girdHelper);
    const cubeArr = createCube();
    addListener(cubeArr);
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
  return <div ref={threeDemo} style={{ position: "relative" }}></div>;
};

export default RaycastingObjectInteraction;
