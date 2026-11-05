"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Still water: slow concentric ripples spreading from one point, drawn as thin cream rings on latte */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  varying vec2 vUv;

  const vec3 LATTE = vec3(0.718, 0.659, 0.604);
  const vec3 CREAM = vec3(0.91, 0.863, 0.776);
  const vec3 BURG  = vec3(0.447, 0.184, 0.216);

  float ring(vec2 p, vec2 c, float t, float speed, float spacing) {
    float d = distance(p, c);
    float r = fract((d - t * speed) / spacing);        // 0..1 within each band
    float line = smoothstep(0.0, 0.015, r) * (1.0 - smoothstep(0.015, 0.05, r));
    // fade with distance so rings dissolve as they travel out
    return line * (1.0 - smoothstep(0.0, 1.1, d));
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.08;
    // base: latte with a soft cream pool at the source
    vec3 col = mix(LATTE, CREAM, 0.25 + 0.35 * (1.0 - smoothstep(0.0, 0.9, length(p))));
    // two ripple families from the centre, offset in phase
    float r1 = ring(p, vec2(0.0), t, 1.0, 0.16);
    float r2 = ring(p, vec2(0.0), t + 0.5, 1.0, 0.16);
    float rings = max(r1, r2 * 0.6);
    col = mix(col, CREAM, rings * 0.9);
    col = mix(col, BURG, rings * 0.08);
    // a very faint second source bottom-right for depth
    float r3 = ring(p, vec2(0.9, -0.5), t * 0.8 + 0.2, 0.8, 0.2);
    col = mix(col, CREAM, r3 * 0.35);
    // vignette
    col = mix(LATTE, col, smoothstep(1.3, 0.3, length(p)));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Water({ motion }: { motion: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } }), []);
  useFrame(({ clock, size }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime * motion;
    u.uRes.value.set(size.width, size.height);
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export function PhilosophyScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="pointer-events-none"
    >
      <Water motion={reducedMotion ? 0 : 1} />
    </Canvas>
  );
}
