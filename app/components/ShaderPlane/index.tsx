import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Vertex shader remains unchanged
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

// Fragment shader code
const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float uTime;

vec3 hueShift(vec3 color, float shift) {
    color = (color - 0.5) * (1.0 + shift) + 0.5;
    return fract(color);
}

vec3 colorize(float n) {
    return vec3(sin(n * 2.0 + uTime), sin(n * 3.0 + uTime / 2.0), sin(n + uTime / 3.0));
}

float pattern(vec2 p) {
    vec2 pos = p * 10.0 - 5.0;
    float dist = length(pos);
    return sin(dist - uTime);
}

void main() {
    float basePattern = pattern(vUv);
    vec3 color = colorize(basePattern);
    color = hueShift(color, sin(uTime));
    gl_FragColor = vec4(color, 1.0);
}`;



// Creation of the shader material
const CustomShaderMaterial = shaderMaterial(
  { uTime: 0 },
  vertexShader,
  fragmentShader
);

// Register the custom shader material
extend({ CustomShaderMaterial });

// ShaderPlane component
export function ShaderPlane() {
  const meshRef = useRef();
  const materialRef = useMemo(() => new CustomShaderMaterial(), []);
  const { gl, size } = useThree();

  useFrame(({ clock }) => {
    materialRef.uniforms.uTime.value = clock.getElapsedTime();
  });

  useEffect(() => {
    const updateGeometrySize = () => {
      const aspectRatio = gl.getSize().width / gl.getSize().height;
      const geometry = meshRef.current.geometry;
      // Update geometry to match the aspect ratio of the viewport
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