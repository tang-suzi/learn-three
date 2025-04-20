import { FC, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const vertexShader = `
    precision lowp float;
    varying vec2 vUv;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    void  main() {
        vUv = uv;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
`;

const fragmentShader = `
    precision lowp float;
    varying vec2 vUv;
    uniform float uScale;
    uniform float uTime;

    #define PI 3.1415926535897932384626433832795

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise (in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    vec4 permute(vec4 x)
    {
        return mod(((x*34.0)+1.0)*x, 289.0);
    }

    vec2 fade(vec2 t)
    {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    }

    float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
    }

    vec2 rotate(vec2 uv, float rotation, vec2 mid){
        return vec2(
          cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
          cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
        );
    }
    void main() {
        //  通过顶点对应的uv决定每一个像素在uv坐标系中的位置
        //  通过uv坐标系中的位置决定每一个像素的颜色
        // gl_FragColor = vec4(vUv, 0.0, 1.0);

        // 使用uv实现渐变效果,从左到右
        // float strength = vUv.x;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 使用uv实现渐变效果,从上到下
        // float strength = vUv.y;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 使用uv实现渐变效果,从上到下,修改变化范围
        // float strength = vUv.y * 0.5;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);
        
        // 使用uv实现渐变效果,从下到上
        // float strength = 1.0 - vUv.y;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 使用uv实现渐变效果, 从左下到右上
        // float strength = 1.0 - vUv.x + vUv.y;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 使用uv实现渐变效果, 从左上到右下
        // float strength = vUv.y - vUv.x;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 通过取模实现渐变效果, 实现百叶窗效果
        // float strength = mod(vUv.y * 10.0, 1.0);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 通过取模和步长实现条纹效果
        // float strength = step(0.3, mod(vUv.y * 10.0, 1.0));
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 横纵向条纹相加
        // float strengthX = mod(vUv.x * 10.0, 1.0);
        // float strengthY = mod(vUv.y * 10.0, 1.0);
        // float strength = step(0.8, strengthX) + step(0.8, strengthY);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 横纵向条纹相减
        // float strengthX = mod(vUv.x * 10.0, 1.0);
        // float strengthY = mod(vUv.y * 10.0, 1.0);
        // float strength = step(0.8, strengthX) - step(0.8, strengthY);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 横纵向条纹相乘
        // float strengthX = mod(vUv.x * 10.0, 1.0);
        // float strengthY = mod(vUv.y * 10.0, 1.0);
        // float strength = step(0.8, strengthX) * step(0.8, strengthY);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 横纵向条纹相除
        // float strengthX = mod(vUv.x * 10.0, 1.0);
        // float strengthY = mod(vUv.y * 10.0, 1.0);
        // float strength = step(0.8, strengthX) / step(0.8, strengthY);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 方块图形
        // float strengthX = step(0.2, mod(vUv.x *  10.0, 1.0));
        // float strengthY = step(0.2, mod(vUv.y * 10.0, 1.0));
        // float strength = strengthX * strengthY;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 箭头
        // float barX = step(0.4, mod(vUv.x * 10.0, 1.0) * step(0.8, mod(vUv.y * 10.0, 1.0)));
        // float barY = step(0.4, mod(vUv.y * 10.0, 1.0) * step(0.8, mod(vUv.x * 10.0, 1.0)));
        // float strength = barX + barY;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);
        // gl_FragColor = vec4(vUv, 1.0, strength); // 用作透明度

        // 让图形动起来
        // float barX = step(0.4, mod((vUv.x+uTime * 0.1) * 10.0, 1.0) * step(0.8, mod(vUv.y * 10.0, 1.0)));
        // float barY = step(0.4, mod(vUv.y * 10.0, 1.0) * step(0.8, mod((vUv.x+uTime * 0.1) * 10.0, 1.0)));
        // float strength = barX + barY;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // T字形
        // float barX = step(0.4, mod(vUv.x * 10.0, 1.0) * step(0.8, mod(vUv.y * 10.0, 1.0)));
        // float barY = step(0.4, mod(vUv.y * 10.0, 1.0) * step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)));
        // float strength = barX + barY;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 绝对值
        // float strength = abs(vUv.x - 0.5);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 十字交叉
        // float strengthX = abs(vUv.x - 0.5);
        // float strengthY = abs(vUv.y - 0.5);
        // float strength = min(strengthX, strengthY);
        // float strength = max(strengthX, strengthY);
        // float strength = 1.0 - max(strengthX, strengthY);
        // float strength = strengthX + strengthY;
        // float strength = strengthX - strengthY;
        // float strength = strengthX * strengthY;
        // float strength = strengthX / strengthY;
        // float strength = step(0.2, strengthX) + step(0.2, strengthY);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 利用取整实现条纹渐变
        // 向上取整
        // float strength = floor(vUv.x * 10.0) / 10.0;
        // gl_FragColor = vec4(strength, strength, strength, 1.0);
        // 向下取整
        // float strength = ceil(vUv.y * 10.0) / 10.0;
        // gl_FragColor = vec4(strength, strength,strength, 1.0);

        // 随机
        // float strength = random(vUv);
        // gl_FragColor = vec4(strength, strength,strength, 1.0);

        // 随机加格子效果
        // float strength = ceil(vUv.x*10.0) / 10.0 * ceil(vUv.y*10.0) / 10.0;
        // strength = random(vec2(strength, strength));
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // length 返回向量长度
        // float strength = length(vUv);
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // distance 根据两个向量的距离渐变
        // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));
        // gl_FragColor = vec4(strength, strength, strength, 1.0);

        // 椭圆
        // float strength =0.15 / distance(vec2(vUv.x,(vUv.y-0.5)*5.0),vec2(0.5,0.5)) - 1.0;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 十字交叉星星
        // float  strength = 0.15 / distance(vec2(vUv.x,(vUv.y-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
        // strength += 0.15 / distance(vec2(vUv.y,(vUv.x-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 旋转星星
        // vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));
        // vec2 rotateUv = rotate(vUv,uTime,vec2(0.5));
        // float  strength = 0.15 / distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
        // strength += 0.15 / distance(vec2(rotateUv.y,(rotateUv.x-0.5)*5.0+0.5),vec2(0.5,0.5)) - 1.0;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 绘制圆
        // float strength = step(0.5,distance(vUv,vec2(0.5))+0.25) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 32圆环
        // float strength = step(0.5,distance(vUv,vec2(0.5))+0.35) ;
        // strength *= (1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25)) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 渐变环
        // float strength =  abs(distance(vUv,vec2(0.5))-0.25);
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 打靶
        // float strength = step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 36圆环
        // float strength = 1.0 - step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 37波浪环
        // vec2 waveUv = vec2(
        //     vUv.x,
        //     vUv.y+sin(vUv.x*30.0)*0.1
        // );
        // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25))   ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // vec2 waveUv = vec2(
        //   vUv.x+sin(vUv.y*30.0)*0.1,
        //   vUv.y+sin(vUv.x*30.0)*0.1
        // );
        // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // vec2 waveUv = vec2(
        //     vUv.x+sin(vUv.y*100.0)*0.1,
        //     vUv.y+sin(vUv.x*100.0)*0.1
        // );
        // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25))   ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 根据角度显示视图
        // float strength = atan(vUv.x,vUv.y);;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 根据角度实现螺旋渐变
        // float angle = atan(vUv.x-0.5,vUv.y-0.5);
        // float strength = (angle+3.14)/6.28;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 雷达
        // float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
        // float angle = atan(vUv.x-0.5,vUv.y-0.5);
        // float strength = (angle+3.14)/6.28;
        // gl_FragColor =vec4(strength,strength,strength,alpha);

        // 通过时间实现动态选择
        // // vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));
        // vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
        // float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
        // float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
        // float strength = (angle+3.14)/6.28;
        // gl_FragColor =vec4(strength,strength,strength,alpha);

        // 万花筒
        // float angle = atan(vUv.x-0.5,vUv.y-0.5)/PI;
        // float strength = mod(angle*10.0,1.0);
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 光芒四射
        // float angle = atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
        // float strength = sin(angle*100.0);
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 使用噪声实现烟雾、波纹效果
        // float strength = noise(vUv);
        // gl_FragColor =vec4(strength,strength,strength,1.0);


        // float strength = noise(vUv * 10.0);
        // gl_FragColor =vec4(strength,strength,strength,1.0);


        // float strength = step(0.5,noise(vUv * 100.0)) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 通过时间设置波形
        // float strength = abs(cnoise(vUv * 10.0)) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // float strength = step(uScale,cnoise(vUv * 10.0+uTime)) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 发光路径
        // float strength =1.0 - abs(cnoise(vUv * 10.0)) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // 波纹效果
        // float strength = sin(cnoise(vUv * 10.0)*5.0+uTime) ;
        // gl_FragColor =vec4(strength,strength,strength,1.0);

        // float strength = step(0.9,sin(cnoise(vUv * 10.0)*20.0))  ;
        // gl_FragColor =vec4(strength,strength,strength,1);

        // 使用混合函数混颜色
        // vec3 purpleColor = vec3(1.0, 0.0, 1.0);
        // vec3 greenColor = vec3(0.0, 1.0, 0.0);
        // float strength = step(uScale,sin(cnoise(vUv * 10.0)*20.0))  ;
        // vec3 mixColor =  mix(greenColor,purpleColor,strength);
        // gl_FragColor =vec4(mixColor,1.0);

        vec3 purpleColor = vec3(1.0, 0.0, 1.0);
        vec3 uvColor = vec3(vUv,1.0);
        float strength = step(uScale,sin(cnoise(vUv * 10.0)*20.0))  ;
        vec3 mixColor =  mix(purpleColor,uvColor,strength);
        gl_FragColor =vec4(mixColor,1.0);
    }
`;

const ShaderFunc: FC = () => {
  const threeDemo = useRef<HTMLDivElement | null>(null);
  const hasInit = useRef<boolean>(false);
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let controls: OrbitControls | null = null;
  let axesHelper: THREE.AxesHelper | null = null;
  let material: THREE.RawShaderMaterial | null = null;
  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();
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
    camera.position.set(0.5, 0.5, 2);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      threeDemo.current?.parentNode.clientWidth,
      threeDemo.current?.parentNode.clientHeight
    );
    threeDemo.current?.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  };
  const createObjects = () => {
    const params = {
      uScale: 0,
    };
    const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);
    material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uTexture: {
          value: textureLoader.load(
            new URL("./../../../assets/texture/ca.jpeg", import.meta.url).href
          ),
        },
        uScale: {
          value: params.uScale,
        },
      },
    });
    const floor = new THREE.Mesh(geometry, material);
    scene.add(floor);
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    threeDemo.current?.appendChild(gui.domElement);
    gui.add(params, "uScale", 0, 1, 0.1).onChange((value) => {
      material.uniforms.uScale.value = value;
    });
  };
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    if (material) {
      material.uniforms.uTime.value = elapsedTime;
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
  });
  return <div ref={threeDemo} style={{ position: "relative" }}></div>;
};

export default ShaderFunc;
