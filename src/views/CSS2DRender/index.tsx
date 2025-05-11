import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";

const CSSRender: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let textureLoader: THREE.TextureLoader | null = null;
  let moonMesh: THREE.Mesh | null = null;
  let labelRenderer: CSS2DRenderer | null = null;
  let chinaLabel: CSS2DObject | null = null;
  const raycaster = new THREE.Raycaster();
  const clock = new THREE.Clock();
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.parentNode.clientWidth /
        containerRef.current.parentNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, -10);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      containerRef.current.parentNode.clientWidth,
      containerRef.current.parentNode.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(
      containerRef.current.parentNode.clientWidth,
      containerRef.current.parentNode.clientHeight
    );
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.left = "0px";
    labelRenderer.domElement.style.zIndex = "10";
    labelRenderer.domElement.style.color = "#fff";
    containerRef.current.appendChild(labelRenderer.domElement);

    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 100;
  };
  const addLight = () => {
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 0, 1);
    dirLight.layers.enableAll();
    scene.add(dirLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    moonMesh.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

    const chinaLabelPosition = chinaLabel.position.clone();
    const chinaLabelDistance = chinaLabelPosition.distanceTo(camera.position);
    chinaLabelPosition.project(camera);
    raycaster.setFromCamera(chinaLabelPosition, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length === 0) {
      chinaLabel.element.style.opacity = "1";
    } else {
      const distance = intersects[0].distance;
      if (distance < chinaLabelDistance) {
        chinaLabel.element.style.opacity = "0.1";
      } else {
        chinaLabel.element.style.opacity = "1";
      }
    }

    controls.update();
    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
  };
  const addObjects = () => {
    const earthGeometry = new THREE.SphereGeometry(1, 16, 16);
    const earthMaterial = new THREE.MeshPhongMaterial({
      specular: 0x333333,
      shininess: 5,
      map: textureLoader.load(
        new URL(
          "./../../assets/texture/planets/earth_atmos_2048.jpg",
          import.meta.url
        ).href
      ),
      specularMap: textureLoader.load(
        new URL(
          "./../../assets/texture/planets/earth_specular_2048.jpg",
          import.meta.url
        ).href
      ),
      normalMap: textureLoader.load(
        new URL(
          "./../../assets/texture/planets/earth_normal_2048.jpg",
          import.meta.url
        ).href
      ),
      normalScale: new THREE.Vector2(0.85, 0.85),
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load(
        new URL("./../../assets/texture/planets/moon_1024.jpg", import.meta.url)
          .href
      ),
    });
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(4, 4, 4);
    scene.add(moonMesh);

    addTitle(earthMesh, "地球", [0, 0, 0]);
    addTitle(moonMesh, "月亮", [0, 0.3, 0]);
    chinaLabel = addTitle(earthMesh, "中国", [-0.3, 0.5, -0.9]);
  };
  const addTitle = (mesh: THREE.Mesh, text: string, position: number[]) => {
    const div = document.createElement("div");
    div.className = "label";
    div.innerHTML = text;
    const divLabel = new CSS2DObject(div);
    divLabel.position.set(position[0], position[1], position[2]);
    mesh.add(divLabel);
    return divLabel;
  };
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      init();
      addLight();
      addObjects();
      animate();
    }
  }, []);
  return <div ref={containerRef} style={{ position: "relative" }}></div>;
};

export default CSSRender;
