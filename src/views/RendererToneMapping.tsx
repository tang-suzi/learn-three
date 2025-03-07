import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const RendererToneMapping: FC = () => {
  const threeDemo = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.TextureLoader | null = null;
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 2, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.clientWidth,
      threeDemo.current?.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    textureLoader = new THREE.TextureLoader();
    const jpgTexture = textureLoader.load(
      new URL("./../assets/texture/brick/brick_diffuse.jpg", import.meta.url)
        .href
    );

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: jpgTexture,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // jpg/png
    const pngTexture = textureLoader.load(
      new URL(
        "./../assets/texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k.jpg",
        import.meta.url
      ).href
    );
    pngTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = pngTexture;
    scene.environment = pngTexture;

    // ktx2 全景图无效果，只有物体有效果
    // const ktx2Loader = new KTX2Loader()
    //   .setTranscoderPath("/basis/")
    //   .detectSupport(renderer);
    // ktx2Loader.load(
    //   new URL(
    //     "./../assets/texture/opt/ktx2/Alex_Hart-Nature_Lab_Bones_2k_uastc_flipY_nomipmap.ktx2",
    //     import.meta.url
    //   ).href,
    //   (texture) => {
    //     texture.mapping = THREE.EquirectangularReflectionMapping;
    //     scene.background = texture;
    //     scene.environment = texture;
    //   }
    // );

    // 色调映射
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);

    gui.add(renderer, "toneMapping", {
      无色调映射: THREE.NoToneMapping, // 默认无
      线性色调映射: THREE.LinearToneMapping,
      Reinhard色调映射: THREE.ReinhardToneMapping,
      Cineon色调映射: THREE.CineonToneMapping,
      ACESFilmic色调映射: THREE.ACESFilmicToneMapping,
      AgX色调映射: THREE.AgXToneMapping,
      中性色调映射: THREE.NeutralToneMapping,
      自定义色调映射: THREE.CustomToneMapping,
    });
    gui.add(renderer, "toneMappingExposure", 0, 10, 0.01);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const animate = () => {
      requestAnimationFrame(animate);
      controls?.update();
      renderer?.render(scene!, camera!);
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

export default RendererToneMapping;
