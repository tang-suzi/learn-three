import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import basicVertexShader from "./vertex.glsl?raw";
// import basicFragmentShader from "./fragmentShader.glsl?raw";
import rawVertexShader from "./rawVertex.glsl?raw";
import rawFragmentShader from "./rawFragment.glsl?raw";

const CreateShaderMaterial: FC = () => {
  const threeDemo = useRef<HTMLDivElement | null>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let rawShaderMaterial: THREE.RawShaderMaterial | null = null;
  const clock = new THREE.Clock();
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0.5, 0.5, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  };
  const createObjects = () => {
    // 创建材质
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // 创建着色器材质
    // const shaderMaterial = new THREE.ShaderMaterial({
    //   // 顶点着色器
    //   // 投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标
    //   vertexShader: `
    //     void main() {
    //       gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    //     }
    //   `,
    //   // 片元着色器
    //   fragmentShader: `
    //     void main() {
    //       gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    //     }
    //   `,
    // });
    // const shaderMaterial = new THREE.ShaderMaterial({
    //   vertexShader: basicVertexShader,
    //   fragmentShader: basicFragmentShader,
    // });

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      new URL("./../../../assets/texture/ca.jpeg", import.meta.url).href
    );

    rawShaderMaterial = new THREE.RawShaderMaterial({
      vertexShader: rawVertexShader,
      fragmentShader: rawFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
    });

    // const floor = new THREE.Mesh(
    //   new THREE.PlaneGeometry(1, 1, 64, 64),
    //   material
    // );
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 64, 64),
      rawShaderMaterial
    );

    scene.add(floor);
  };
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    if (rawShaderMaterial) {
      rawShaderMaterial.uniforms.uTime.value = elapsedTime;
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      createObjects();
      animate();
    }
  }, []);
  return <div ref={threeDemo}></div>;
};

export default CreateShaderMaterial;
