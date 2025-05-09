import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const HitCharacters: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let controls: OrbitControls | null = null;
  let rgbeLoader: RGBELoader | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let textureLoader: THREE.TextureLoader | null = null;
  let clock: THREE.Clock | null = null;
  const customUniforms = {
    uTime: {
      value: 0,
    },
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      threeDemo.current?.parentNode.clientWidth /
        threeDemo.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    rgbeLoader = new RGBELoader();
    gltfLoader = new GLTFLoader();
    textureLoader = new THREE.TextureLoader();
    clock = new THREE.Clock();
  };
  const loadModel = () => {
    const modelTexture = textureLoader?.load(
      new URL(
        "./../../../assets/model/LeePerrySmith/color.jpg",
        import.meta.url
      ).href
    );
    const normalTexture = textureLoader.load(
      new URL(
        "./../../../assets/model/LeePerrySmith/normal.jpg",
        import.meta.url
      ).href
    );

    const material = new THREE.MeshStandardMaterial({
      map: modelTexture,
      normalMap: normalTexture,
    });
    material.onBeforeCompile = (shader) => {
      //   console.log(shader);
      shader.uniforms.uTime = customUniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
        #include <common>
        mat2 rotate2d(float _angle) {
            return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
        uniform float uTime;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
        #include <beginnormal_vertex>
        float angle = sin(position.y+uTime)*0.5;
        mat2 rotateMatrix = rotate2d(angle);
        objectNormal.xz = rotateMatrix * objectNormal.xz;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        // float angle = PI;
        // float angle = transformed.y * 0.2;
        // mat2 rotateMaterix = rotate2d(angle);
        transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };
    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });
    depthMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
          #include <common>
          mat2 rotate2d(float _angle){
            return mat2(cos(_angle),-sin(_angle),
                        sin(_angle),cos(_angle));
          }
          uniform float uTime;
          `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          #include <begin_vertex>
          float angle = sin(position.y+uTime) *0.5;
          mat2 rotateMatrix = rotate2d(angle);
          transformed.xz = rotateMatrix * transformed.xz;
          `
      );
    };
    gltfLoader.load(
      new URL(
        "./../../../assets/model/LeePerrySmith/LeePerrySmith.glb",
        import.meta.url
      ).href,
      (gltf) => {
        const mesh = gltf.scene.children[0];
        mesh.castShadow = true;
        mesh.material = material;
        mesh.customDepthMaterial = depthMaterial;
        scene.add(mesh);
      }
    );
  };
  const addLight = () => {
    const directionLight = new THREE.DirectionalLight(0xffffff, 1);
    directionLight.castShadow = true;
    directionLight.position.set(0, 0, 200);
    scene?.add(directionLight);
  };
  const addObjects = () => {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -6);
    plane.receiveShadow = true;
    scene?.add(plane);
  };
  const animate = () => {
    const time = clock.getElapsedTime();
    customUniforms.uTime.value = time;
    requestAnimationFrame(animate);
    controls?.update();
    renderer?.render(scene!, camera!);
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      addLight();
      loadModel();
      addObjects();
      animate();
    }
  }, []);
  return <div ref={threeDemo}></div>;
};

export default HitCharacters;
