import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// Vertex shader remains the same
const vertexShader = `
precision mediump float;
uniform float uTime;
varying vec2 vUv;
void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
}`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 iResolution;
varying vec2 vUv;

// Classic Perlin noise implementation
// This is a simplified version for demonstration purposes
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // Mix 4 corners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void mainImage(out vec4 O, vec2 U) {
    vec2 z = iResolution.xy; // normalized coordinates
    U = (U + U - z) / z.y;

    z = U - vec2(-1, 0);
    U.x -= .5; // Moebius transform
    U *= mat2(z, -z.y, z.x) / dot(U, U);
    U += .5; // offset. not included as length(U+=.5) because of an ATI bug

    // Add Perlin noise to the coordinates
    U += 0.1 * noise(U * 5.0);

    // Calculate theta angle based on coordinates
    float theta = atan(U.y, U.x);

    // Use theta to create spiral effect on color
    vec3 color = vec3(
        0.5 + 0.5 * sin(3.0 * theta + uTime),
        0.5 + 0.5 * sin(3.0 * theta + uTime + 2.1),
        0.5 + 0.5 * sin(3.0 * theta + uTime - 2.1)
    );

    O = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}

`;

const CustomShaderMaterial = shaderMaterial(
  { uTime: 0, iResolution: new THREE.Vector2() },
  vertexShader,
  fragmentShader
);

extend({ CustomShaderMaterial });

export function ShaderPlane() {
  const meshRef = useRef();
  const materialRef = useMemo(() => new CustomShaderMaterial(), []);
  const { gl, size } = useThree();

  useFrame(({ clock }) => {
    materialRef.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.uniforms.iResolution.value.set(size.width, size.height);
  });

  useEffect(() => {
    const updateGeometrySize = () => {
      const aspectRatio = gl.getSize().width / gl.getSize().height;
      const geometry = meshRef.current.geometry;
      geometry.scale(aspectRatio, 1, 1);
    };

    window.addEventListener('resize', updateGeometrySize);
    return () => window.removeEventListener('resize', updateGeometrySize);
  }, [gl]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size.width, size.height]} />
      <primitive object={materialRef} attach="material" />
    </mesh>
  );
}
