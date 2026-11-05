"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Foam bubbles: translucent spheres with a fresnel rim, drifting slowly upward. A nod to the wash itself. */
const vert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  uniform vec3 uTint;
  uniform float uAlpha;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
    // soft highlight up-left like a studio light
    float hi = pow(max(dot(vNormal, normalize(vec3(-0.5, 0.8, 0.6))), 0.0), 24.0);
    vec3 col = mix(uTint, vec3(1.0), fres * 0.7 + hi);
    float a = (fres * 0.9 + hi * 0.8 + 0.05) * uAlpha;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

type Bubble = { x: number; y: number; z: number; r: number; speed: number; phase: number; tint: THREE.Color };

function Bubbles({ count, motion }: { count: number; motion: number }) {
  const group = useRef<THREE.Group>(null);
  const bubbles = useMemo<Bubble[]>(() => {
    const rnd = mulberry32(7);
    const tints = [new THREE.Color("#E8DCC6"), new THREE.Color("#B7A89A"), new THREE.Color("#722F37")];
    return Array.from({ length: count }, (_, i) => ({
      x: (rnd() - 0.5) * 12,
      y: (rnd() - 0.5) * 6,
      z: -1 - rnd() * 3,
      r: 0.14 + rnd() * 0.36,
      speed: 0.08 + rnd() * 0.12,
      phase: rnd() * Math.PI * 2,
      tint: tints[i % 3],
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime * motion;
    g.children.forEach((m, i) => {
      const b = bubbles[i];
      const y = b.y + ((t * b.speed) % 7);
      m.position.set(b.x + Math.sin(t * 0.3 + b.phase) * 0.25, ((y + 3.5) % 7) - 3.5, b.z);
    });
  });

  return (
    <group ref={group}>
      {bubbles.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <sphereGeometry args={[b.r, 32, 32]} />
          <shaderMaterial
            vertexShader={vert}
            fragmentShader={frag}
            transparent
            depthWrite={false}
            uniforms={{ uTint: { value: b.tint }, uAlpha: { value: 0.42 } }}
          />
        </mesh>
      ))}
    </group>
  );
}

// Small deterministic PRNG so the layout is identical on every load
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FeaturesBackdrop({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="pointer-events-none"
    >
      <Bubbles count={16} motion={reducedMotion ? 0 : 1} />
    </Canvas>
  );
}
