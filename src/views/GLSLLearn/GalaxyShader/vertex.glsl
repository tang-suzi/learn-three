varying vec2 vUv;
attribute float imgIndex;
varying float vImgIndex;
attribute float aScale;
uniform float uTime;
attribute vec3 color;
varying vec3 vColor;

void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    float angle = atan(modelPosition.x, modelPosition.z);
    float distance = length(modelPosition.xz);
    float angleOffset = 1.0 / distance*uTime;
    angle += angleOffset;

    modelPosition.x = cos(angle) * distance;
    modelPosition.z = sin(angle) * distance;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 100.0 / -viewPosition.z * aScale;
    vUv = uv;
    vImgIndex = imgIndex;
    vColor = color;
}