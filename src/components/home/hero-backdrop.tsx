"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Full-bleed shader plane: slow silk-like folds in the brand palette + fine film grain */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform float uMotion;
  varying vec2 vUv;

  // Brand colours
  const vec3 LATTE    = vec3(0.718, 0.659, 0.604); // #B7A89A
  const vec3 MOCHA    = vec3(0.910, 0.863, 0.776); // #E8DCC6
  const vec3 BURGUNDY = vec3(0.447, 0.184, 0.216); // #722F37

  // Simplex noise (Ashima)
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * snoise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  float grain(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.05 * uMotion;

    // Domain-warped folds: slow, large, fabric-like
    vec2 q = vec2(fbm(p * 1.1 + t), fbm(p * 1.1 - t * 0.7 + 3.1));
    float folds = fbm(p * 1.6 + 1.8 * q);

    // Fine diagonal weave for a textile feel
    float weave = sin((uv.x - uv.y) * 900.0) * 0.5 + 0.5;
    weave = (weave - 0.5) * 0.035;

    // Base colour across latte ↔ mocha
    float tone = smoothstep(-0.7, 0.8, folds);
    vec3 col = mix(LATTE, MOCHA, tone * 0.32);

    // Burgundy pooling in the deepest folds, very low opacity
    float pool = smoothstep(0.3, 0.8, -folds);
    col = mix(col, BURGUNDY, pool * 0.1);

    col += weave;
    col += (grain(uv * uRes * 0.5 + fract(t)) - 0.5) * 0.045;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Plane({ motion }: { motion: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMotion: { value: motion },
    }),
    [motion],
  );

  useFrame(({ clock, size }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export function HeroBackdrop({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="pointer-events-none"
    >
      <Plane motion={reducedMotion ? 0 : 1} />
    </Canvas>
  );
}
