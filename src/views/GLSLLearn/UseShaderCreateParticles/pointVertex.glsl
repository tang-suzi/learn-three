void main() {
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    // 设置顶点大小
    gl_PointSize = 80.0;
}