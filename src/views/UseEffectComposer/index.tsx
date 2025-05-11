import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"; // 合成效果
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"; // 渲染通道
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const UseEffectComposer: FC = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let gltfLoader: GLTFLoader | null = null;
  let effectComposer: EffectComposer | null = null;
  let renderPass: RenderPass | null = null;
  let gui: GUI | null = null;
  let cubeTextureLoader: THREE.CubeTextureLoader | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current?.parentNode.clientWidth /
        canvasRef.current?.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    renderer = new THREE.WebGLRenderer({});
    renderer.setSize(
      canvasRef.current?.parentNode.clientWidth,
      canvasRef.current?.parentNode.clientHeight
    );
    canvasRef.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    canvasRef.current?.appendChild(gui.domElement);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    gltfLoader = new GLTFLoader();
    cubeTextureLoader = new THREE.CubeTextureLoader();
  };
  const loadTexture = () => {
    const envMapTexture = cubeTextureLoader?.load([
      new URL("./../../assets/texture/environmentMaps/px.jpg", import.meta.url)
        .href,
      new URL("./../../assets/texture/environmentMaps/nx.jpg", import.meta.url)
        .href,
      new URL("./../../assets/texture/environmentMaps/py.jpg", import.meta.url)
        .href,
      new URL("./../../assets/texture/environmentMaps/ny.jpg", import.meta.url)
        .href,
      new URL("./../../assets/texture/environmentMaps/pz.jpg", import.meta.url)
        .href,
      new URL("./../../assets/texture/environmentMaps/nz.jpg", import.meta.url)
        .href,
    ]);
    scene.background = envMapTexture;
    scene.environment = envMapTexture;
  };
  const createLight = () => {
    const directionLight = new THREE.DirectionalLight("#ffffff", 1);
    directionLight.castShadow = true;
    directionLight.position.set(0, 0, 200);
    scene.add(directionLight);
  };
  const loadGLTF = () => {
    gltfLoader.load(
      new URL(
        "./../../assets/model/DamagedHelmet/glTF/DamagedHelmet.gltf",
        import.meta.url
      ).href,
      (gltf) => {
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        scene.add(mesh);
      }
    );
  };
  const addEffectComposer = () => {
    effectComposer = new EffectComposer(renderer);
    effectComposer.setSize(
      canvasRef.current?.parentNode.clientWidth,
      canvasRef.current?.parentNode.clientHeight
    );
    renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    // 添加后处理效果
    // 点屏幕效果
    const dotScreenPass = new DotScreenPass();
    dotScreenPass.enabled = false; // 默认关闭
    effectComposer.addPass(dotScreenPass);
    // SMAA抗锯齿
    const smaaPass = new SMAAPass();
    smaaPass.enabled = false; // 默认开启
    effectComposer.addPass(smaaPass);

    // SSAARenderPass 抗锯齿
    const ssaaRenderPass = new SSAARenderPass(scene, camera);
    ssaaRenderPass.enabled = false;
    effectComposer.addPass(ssaaRenderPass);

    // 故障频闪效果
    const glitchPass = new GlitchPass();
    glitchPass.enabled = false;
    effectComposer.addPass(glitchPass);

    // 烈日发光效果
    const unrealBloomParams = {
      enabled: false,
      threshold: 0,
      strength: 1,
      radius: 0,
      exposure: 1,
    };
    const unrealBloomPass = new UnrealBloomPass();

    unrealBloomPass.enabled = unrealBloomParams.enabled;
    effectComposer.addPass(unrealBloomPass);
    const realPassFolder = gui?.addFolder("RealPass");
    realPassFolder
      ?.add(unrealBloomParams, "enabled")
      .onChange(function (value) {
        unrealBloomPass.enabled = value;
      });
    realPassFolder
      .add(unrealBloomParams, "threshold", 0.0, 1.0)
      .onChange(function (value) {
        unrealBloomPass.threshold = Number(value);
      });
    realPassFolder
      .add(unrealBloomParams, "strength", 0.0, 3.0)
      .onChange(function (value) {
        unrealBloomPass.strength = Number(value);
      });

    realPassFolder
      .add(unrealBloomParams, "radius", 0.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        unrealBloomPass.radius = Number(value);
      });

    const colorParams = {
      r: 0,
      g: 0,
      b: 0,
    };
    const shaderPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uColor: {
          value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b),
        },
      },
      vertexShader: `
            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            }
        `,
      fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D tDiffuse;
            uniform vec3 uColor;
            void main(){
                vec4 color = texture2D(tDiffuse,vUv);
                // gl_FragColor = vec4(vUv,0.0,1.0);
                color.xyz+= uColor;
                gl_FragColor = color;
            }
        `,
    });
    const shaderFolder = gui?.addFolder("ShaderPass");
    shaderFolder
      ?.add(colorParams, "r", -1.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        shaderPass.uniforms.uColor.value.r = value;
      });
    shaderFolder
      ?.add(colorParams, "g", -1.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        shaderPass.uniforms.uColor.value.g = value;
      });
    shaderFolder
      ?.add(colorParams, "b", -1.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        shaderPass.uniforms.uColor.value.b = value;
      });
    effectComposer.addPass(shaderPass);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    // renderer.render(scene, camera);
    effectComposer?.render();
    controls?.update();
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      loadTexture();
      loadGLTF();
      addEffectComposer();
      createLight();
      animate();
    }
  }, []);
  return <div ref={canvasRef} style={{ position: "relative" }}></div>;
};

export default UseEffectComposer;
