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

float colormap_red(float x) {
    if (x < 0.0) return 54.0 / 255.0;
    else if (x < 20049.0 / 82979.0) return (829.79 * x + 54.51) / 255.0;
    else return 1.0;
}

float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) return 0.0;
    else if (x < 327013.0 / 810990.0) return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    else if (x <= 1.0) return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    else return 1.0;
}

float colormap_blue(float x) {
    if (x < 0.0) return 54.0 / 255.0;
    else if (x < 7249.0 / 82979.0) return (829.79 * x + 54.51) / 255.0;
    else if (x < 20049.0 / 82979.0) return 127.0 / 255.0;
    else if (x < 327013.0 / 810990.0) return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    else return 1.0;
}

vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
}

float pattern(vec2 p) {
    float total = 0.0;
    total += sin(p.x * 10.0 + uTime);
    total += cos(p.y * 10.0 + uTime);
    return total;
}

void main() {
    float shade = pattern(vUv);
    vec4 color = colormap(shade);
    gl_FragColor = vec4(color.rgb, 1.0);
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