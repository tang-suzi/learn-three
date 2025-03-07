import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { TGALoader } from "three/addons/loaders/TGALoader.js";

const KTX2_DDS_TGATexture: FC = () => {
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
    // const pngTexture = textureLoader.load(
    //   new URL(
    //     "./../assets/texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k.jpg",
    //     import.meta.url
    //   ).href
    // );
    // pngTexture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = pngTexture;
    // scene.environment = pngTexture;

    // ktx2
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

    // dds
    // const ddsLoader = new DDSLoader();
    // ddsLoader.load(
    //   new URL(
    //     "./../assets/texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k_bc3_nomip.dds",
    //     import.meta.url
    //   ).href,
    //   (texture) => {
    //     texture.mapping = THREE.EquirectangularReflectionMapping;
    //     scene.background = texture;
    //     scene.environment = texture;
    //     texture.anisotropy = 16;
    //   }
    // );

    // tga
    const tgaLoader = new TGALoader();
    tgaLoader.load(new URL("./../assets/texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k-mipmap.tga", import.meta.url).href, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

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

export default KTX2_DDS_TGATexture;
