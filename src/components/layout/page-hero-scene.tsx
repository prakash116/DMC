"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Glossy paint surface: a displaced plane with flowing cream light bands, like clear-coat under studio lights */
const vert = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vH;
  varying vec3 vN;

  // cheap layered waves
  float h(vec2 p, float t) {
    return sin(p.x * 1.6 + t * 0.6) * 0.18
         + sin(p.y * 2.2 - t * 0.45) * 0.12
         + sin((p.x + p.y) * 1.1 + t * 0.35) * 0.14;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float e = 0.08;
    float hh = h(pos.xy, uTime);
    float hx = h(pos.xy + vec2(e, 0.0), uTime);
    float hy = h(pos.xy + vec2(0.0, e), uTime);
    pos.z += hh;
    vH = hh;
    vN = normalize(vec3(-(hx - hh) / e, -(hy - hh) / e, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const frag = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vH;
  varying vec3 vN;

  const vec3 LATTE = vec3(0.718, 0.659, 0.604); // #B7A89A
  const vec3 CREAM = vec3(0.91, 0.863, 0.776);  // #E8DCC6
  const vec3 BURG  = vec3(0.447, 0.184, 0.216); // #722F37

  void main() {
    // light silk: cream on the crests, latte in the troughs
    vec3 col = mix(LATTE, CREAM, smoothstep(-0.3, 0.35, vH));
    // faint burgundy pooling in the deepest folds
    col = mix(col, BURG, smoothstep(0.1, 0.5, -vH) * 0.14);
    // soft light bands sweeping diagonally
    float band = sin((vUv.x * 2.2 - vUv.y * 1.4) * 6.283 + uTime * 0.5);
    float bands = smoothstep(0.86, 0.995, band) * 0.35 + smoothstep(0.6, 0.9, band) * 0.08;
    float slope = 1.0 - vN.z;
    col += vec3(1.0) * (bands * 0.35 + slope * 0.5);
    // pointer highlight
    float d = distance(vUv, uPointer);
    col += vec3(1.0) * (1.0 - smoothstep(0.0, 0.35, d)) * 0.07;
    // fade to latte at the edges
    float v = smoothstep(1.1, 0.35, distance(vUv, vec2(0.5)));
    col = mix(LATTE, col, v);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Surface({ motion, pointer }: { motion: number; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0.5, 0.5) } }), []);
  useFrame(({ clock }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime * motion;
    u.uPointer.value.lerp(new THREE.Vector2(pointer.current.x, pointer.current.y), 0.06);
  });
  return (
    <mesh rotation={[-0.75, 0, 0.12]} position={[0, -0.4, -1]}>
      <planeGeometry args={[22, 16, 140, 100]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export function PageHeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const pointer = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 5.2], fov: 45 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="pointer-events-none"
    >
      <Surface motion={reducedMotion ? 0 : 1} pointer={pointer} />
    </Canvas>
  );
}
