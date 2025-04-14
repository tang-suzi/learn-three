precision lowp float; // 顶点着色器精度设置
// 这里使用 lowp 是因为我们只需要低精度的颜色计算
// lowp float: 低精度浮点数，适用于颜色计算
// mediump float: 中等精度浮点数，适用于大多数计算
// highp float: 高精度浮点数，适用于高精度计算
// lowp int: 低精度整数，适用于颜色计算
// mediump int: 中等精度整数，适用于大多数计算
// highp int: 高精度整数，适用于高精度计算

// attribute 变量
// attribute 变量是顶点着色器的输入变量
// attribute 变量用于传递顶点数据到顶点着色器
// attribute 变量通常用于传递顶点位置、法线、纹理坐标等信息
// attribute 变量的类型可以是 float、vec2、vec3、vec4、mat2、mat3、mat4 等
// attribute 变量的名称可以是任意合法的标识符
// attribute 变量的值在渲染过程中不会改变
// attribute 变量的值通常是从缓冲区中读取的
attribute vec3 position; // 顶点位置
attribute vec2 uv; // 纹理坐标

// uniform 变量
// uniform 变量是全局变量，可以在顶点着色器和片元着色器中使用
// uniform 变量的值在渲染过程中不会改变
// uniform 变量通常用于传递变换矩阵、光源位置、材质属性等信息
uniform mat4 modelMatrix; // 模型矩阵
uniform mat4 viewMatrix; // 视图矩阵
uniform mat4 projectionMatrix; // 投影矩阵

// varying 变量
// varying 变量用于在顶点着色器和片元着色器之间传递数据
// varying 变量的值在顶点着色器中计算，并在片元着色器中使用
// varying 变量的值在渲染过程中会被插值计算
// varying 变量的值通常用于传递纹理坐标、法线、颜色等信息
// varying 变量的类型可以是 float、vec2、vec3、vec4、mat2、mat3、mat4 等
// varying 变量的名称可以是任意合法的标识符
// varying 变量的值在渲染过程中会被插值计算

varying vec2 vUv; // 传递给片元着色器的变量
varying float vElevation; // 传递给片元着色器的变量

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition 偏移
    // modelPosition.x+=1.0;
    // modelPosition.z+=1.0;

    // modelPosition.z += modelPosition.x;

    modelPosition.z = sin(modelPosition.x * 10.0)*0.05;
    modelPosition.z += sin(modelPosition.y * 10.0)*0.05;
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}