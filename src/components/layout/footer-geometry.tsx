"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Geometric backdrop: wireframe polyhedra in brand colours, drifting slowly, plus a thin lattice plane */

type Shape = {
  geo: THREE.BufferGeometry;
  pos: [number, number, number];
  rot: [number, number, number];
  speed: [number, number];
  color: string;
  opacity: number;
};

function useShapes(): Shape[] {
  return useMemo(() => {
    const edges = (g: THREE.BufferGeometry) => new THREE.EdgesGeometry(g, 1);
    return [
      { geo: edges(new THREE.IcosahedronGeometry(2.6, 0)), pos: [5.2, 0.6, -2], rot: [0.4, 0.2, 0], speed: [0.05, 0.08], color: "#722F37", opacity: 0.28 },
      { geo: edges(new THREE.DodecahedronGeometry(1.7, 0)), pos: [-5.4, -0.8, -3], rot: [0.2, 0.5, 0.1], speed: [-0.06, 0.04], color: "#B7A89A", opacity: 0.6 },
      { geo: edges(new THREE.OctahedronGeometry(1.2, 0)), pos: [-1.2, 2.3, -4], rot: [0.6, 0.1, 0.3], speed: [0.09, -0.05], color: "#722F37", opacity: 0.22 },
      { geo: edges(new THREE.TetrahedronGeometry(0.9, 0)), pos: [1.8, -2.4, -2.5], rot: [0.1, 0.7, 0.2], speed: [-0.07, 0.1], color: "#B7A89A", opacity: 0.55 },
      { geo: edges(new THREE.OctahedronGeometry(0.7, 0)), pos: [7.2, -2.6, -4], rot: [0.3, 0.9, 0.1], speed: [0.08, 0.06], color: "#722F37", opacity: 0.2 },
    ];
  }, []);
}

function Polyhedra({ motion, pointer }: { motion: number; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const shapes = useShapes();

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((m, i) => {
      const s = shapes[i];
      m.rotation.x += delta * s.speed[0] * motion;
      m.rotation.y += delta * s.speed[1] * motion;
    });
    const k = 1 - Math.exp(-delta * 2);
    g.rotation.y += (pointer.current.x * 0.06 - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.04 - g.rotation.x) * k;
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <lineSegments key={i} geometry={s.geo} position={s.pos} rotation={s.rot}>
          <lineBasicMaterial color={s.color} transparent opacity={s.opacity} depthWrite={false} />
        </lineSegments>
      ))}
    </group>
  );
}

/* Thin diamond lattice drawn in a shader so it stays crisp at any size */
const latticeVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;
const latticeFrag = /* glsl */ `
  uniform vec2 uRes;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * uRes;
    // rotate 45° for a diamond grid
    vec2 r = vec2(p.x + p.y, p.x - p.y) / 1.41421;
    float cell = 56.0;
    vec2 g = abs(fract(r / cell + uTime * 0.004) - 0.5);
    float line = 1.0 - smoothstep(0.0, 1.6 / cell, min(g.x, g.y));
    // fade toward the centre so text stays clean; stronger at the edges
    float edge = smoothstep(0.25, 0.9, distance(vUv, vec2(0.5)) * 1.3);
    float a = line * 0.09 * edge;
    gl_FragColor = vec4(0.447, 0.184, 0.216, a);
    #include <colorspace_fragment>
  }
`;

function Lattice({ motion }: { motion: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 } }), []);
  useFrame(({ clock, size }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uRes.value.set(size.width, size.height);
    u.uTime.value = clock.elapsedTime * motion;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={latticeVert} fragmentShader={latticeFrag} uniforms={uniforms} transparent depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export function FooterGeometry({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const motion = reducedMotion ? 0 : 1;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="pointer-events-none"
    >
      <Lattice motion={motion} />
      <Polyhedra motion={motion} pointer={pointer} />
    </Canvas>
  );
}
