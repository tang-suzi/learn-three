import * as THREE from "three";
import vertexShader from "./vertex.glsl?raw";
import fragmentShader from "./fragment.glsl?raw";
import fireworkVertex from "./fireworkVertex.glsl?raw";
import fireworkFragment from "./fireworkFragment.glsl?raw";

export default class Firework {
  constructor({ color, to, from = { x: 0, y: 0, z: 0 } }) {
    this.color = new THREE.Color(color);
    this.position = to;
    this.startGeometry = new THREE.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(startPositionArray, 3)
    );

    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.z;
    this.startGeometry.setAttribute(
      "aStep",
      new THREE.BufferAttribute(astepArray, 3)
    );
    this.clock = new THREE.Clock();

    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: {
          value: this.color,
        },
      },
    });

    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);

    // 创建爆炸烟花
    this.fireworkGeometry = new THREE.BufferGeometry();
    this.fireworkCount = 180;
    const positionFireworkArray = new Float32Array(this.fireworkCount * 3);
    const scaleFireworkArray = new Float32Array(this.fireworkCount);
    const diretcionArray = new Float32Array(this.fireworkCount * 3);
    for (let i = 0; i < this.fireworkCount; i++) {
      // 烟花位置
      positionFireworkArray[i * 3 + 0] = to.x;
      positionFireworkArray[i * 3 + 1] = to.y;
      positionFireworkArray[i * 3 + 2] = to.z;
      // 烟花粒子大小
      scaleFireworkArray[i] = Math.random() * 20.0;
      // 发散角度
      const theta = Math.random() * 2 * Math.PI;
      const beta = Math.random() * 2 * Math.PI;
      const r = Math.random();
      diretcionArray[i * 3 + 0] = r * Math.sin(theta) * r * Math.sin(beta);
      diretcionArray[i * 3 + 1] = r * Math.cos(theta) * r * Math.cos(beta);
      diretcionArray[i * 3 + 2] = r * Math.sin(theta) * r * Math.cos(beta);
    }
    this.fireworkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionFireworkArray, 3)
    );
    this.fireworkGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleFireworkArray, 1)
    );
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(diretcionArray, 3)
    );

    this.fireworkMaterial = new THREE.ShaderMaterial({
      vertexShader: fireworkVertex,
      fragmentShader: fireworkFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: { value: this.color },
      },
    });
    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireworkMaterial
    );

    this.linstener = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.linstener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      new URL("./../../../assets/audio/pow.ogg", import.meta.url).href,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(0.5);
      }
    );
  }
  addScene(scene) {
    this.scene = scene;
    scene.add(this.startPoint);
    scene.add(this.fireworks);
  }
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    if (elapsedTime < 1) {
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else {
      const time = elapsedTime - 1;
      this.startMaterial.uniforms.uSize.value = 0;
      this.startPoint.clear();
      this.startGeometry.dispose();
      this.startMaterial.dispose();

      this.fireworkMaterial.uniforms.uSize.value = 1.0;
      this.fireworkMaterial.uniforms.uTime.value = time;
      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }
      if (time > 5) {
        this.fireworks.clear();
        this.fireworkGeometry.dispose();
        this.fireworkMaterial.dispose();
        if (this.fireworks.parent) {
          this.fireworks.parent.remove(this.fireworks);
        }
        if (this.startPoint.parent) {
          this.startPoint.parent.remove(this.startPoint);
        }
        return "remove";
      }
    }
  }
}
