precision lowp float; // 片元着色器精度设置
varying vec2 vUv; // 传递给片元着色器的变量
varying float vElevation; // 传递给片元着色器的变量

void main() {
    float height = vElevation+0.05*10.0;

    gl_FragColor = vec4(1.0*height, 0.0, 0.0, 1.0); // 设置片元颜色为纹理坐标
}