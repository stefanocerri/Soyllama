import * as THREE from 'three';
import { useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';

// Custom Shader Material setup
interface CustomShaderMaterialProps {
  iTime: { value: number };
  iResolution: { value: THREE.Vector3 };
}

// Extend THREE's ShaderMaterial
class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec3 iResolution;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Simple red color for testing
        }
      `,
      side: THREE.DoubleSide
    });
  }
}

// Extend react-three-fiber to recognize the new ShaderMaterial
extend({ CustomShaderMaterial });

// Now you can use <customShaderMaterial /> in your JSX
