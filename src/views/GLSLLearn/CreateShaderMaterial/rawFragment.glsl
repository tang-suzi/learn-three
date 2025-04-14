precision lowp float; // 片元着色器精度设置
varying vec2 vUv; // 传递给片元着色器的变量
varying float vElevation; // 传递给片元着色器的变量

uniform sampler2D uTexture; // 纹理变量

void main() {
    float height = vElevation+0.05*20.0;
    vec4 textureColor = texture2D(uTexture, vUv); // 采样纹理
    textureColor.rgb*=height;
    gl_FragColor = textureColor; // 设置片元颜色为纹理坐标
}