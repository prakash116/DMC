"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Timeline (seconds) — 4s total */
const T_ARRIVE = 1.15;
const T_WASH = 2.6;
const T_GREEN = 2.75; // light turns green, car pulls away
const T_EXIT = 3.75;
export const T_TOTAL = 4.0;

const DIRTY = { color: new THREE.Color("#5e4b3b"), rough: 0.95, metal: 0.05, clear: 0 };
const CLEAN = { color: new THREE.Color("#722F37"), rough: 0.15, metal: 0.4, clear: 1 };
const FOAM_N = 56;
const MUD_N = 26;
const SPARK_N = 40;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

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

function sedanShape() {
  const s = new THREE.Shape();
  s.moveTo(-1.75, 0.3);
  s.lineTo(-1.8, 0.6);
  s.lineTo(-1.6, 0.78);
  s.lineTo(-0.9, 0.84);
  s.lineTo(-0.55, 1.22);
  s.lineTo(0.55, 1.26);
  s.lineTo(1.05, 0.86);
  s.lineTo(1.65, 0.78);
  s.lineTo(1.82, 0.6);
  s.lineTo(1.8, 0.3);
  s.lineTo(-1.75, 0.3);
  return s;
}

/* Sign board: logo + wordmark drawn to a canvas texture, crisp at any size */
function useSignTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const draw = (logo?: HTMLImageElement) => {
      ctx.fillStyle = "#3a3f49";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(232,220,198,0.35)";
      ctx.lineWidth = 4;
      ctx.strokeRect(14, 14, c.width - 28, c.height - 28);
      const logoH = 150;
      const logoW = logo ? logoH * (logo.width / logo.height) : 0;
      if (logo) ctx.drawImage(logo, 44, (c.height - logoH) / 2, logoW, logoH);
      const textX = 44 + logoW + 36;
      const maxW = c.width - textX - 40;
      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "middle";
      ctx.font = "600 64px 'Cormorant Garamond', Georgia, serif";
      ctx.fillText("THE DETAILING MONK", textX, 100, maxW);
      ctx.fillStyle = "#E8DCC6";
      ctx.font = "500 26px Manrope, system-ui, sans-serif";
      ctx.fillText("PASSION  •  DEVOTION  •  CRAFT", textX + 4, 166, maxW);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      setTex(t);
    };
    const img = new Image();
    img.onload = () => draw(img);
    img.onerror = () => draw();
    img.src = "/logo/logo-dark.png";
  }, []);
  return tex;
}

function Wheel({ x, z, refFn }: { x: number; z: number; refFn: (el: THREE.Group | null) => void }) {
  const side = z > 0 ? 0.135 : -0.135;
  return (
    <group ref={refFn} position={[x, 0.36, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.36, 0.36, 0.26, 20]} />
        <meshStandardMaterial color="#1c1214" roughness={0.85} />
      </mesh>
      <mesh position={[0, side, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
        <meshStandardMaterial color="#B7A89A" metalness={0.85} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, side * 1.07, 0]} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.36]} />
          <meshStandardMaterial color="#E8DCC6" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function TrafficLight({ refFn }: { refFn: (el: THREE.Group | null) => void }) {
  return (
    <group ref={refFn} position={[2.75, 0, 1.45]}>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 2.2, 8]} />
        <meshStandardMaterial color="#2b1d1f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.35, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.22]} />
        <meshStandardMaterial color="#1c1214" roughness={0.5} />
      </mesh>
      {/* lamps: index 0 = red, 1 = green */}
      <mesh name="lamp-red" position={[0, 2.52, 0.12]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#ff3b3b" emissive="#ff1a1a" emissiveIntensity={2.5} />
      </mesh>
      <mesh name="lamp-green" position={[0, 2.19, 0.12]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#2a6b3a" emissive="#1fff5a" emissiveIntensity={0} />
      </mesh>
    </group>
  );
}

function Scene({ onProgress }: { onProgress: (p: number, phase: number) => void }) {
  const car = useRef<THREE.Group>(null);
  const paint = useRef<THREE.MeshPhysicalMaterial>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const brushes = useRef<THREE.Mesh[]>([]);
  const foam = useRef<THREE.InstancedMesh>(null);
  const mud = useRef<THREE.InstancedMesh>(null);
  const sparks = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.Group>(null);
  const gate = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const sign = useSignTexture();

  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(sedanShape(), { depth: 1.5, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 });
    g.translate(0, 0, -0.75);
    return g;
  }, []);

  const seeds = useMemo(() => {
    const rnd = mulberry32(11);
    return {
      foam: Array.from({ length: FOAM_N }, () => ({ a: rnd() * Math.PI * 2, r: 0.9 + rnd() * 1.3, y: rnd() * 1.4, s: 0.06 + rnd() * 0.12, ph: rnd() * Math.PI * 2, sp: 0.6 + rnd() * 1.2 })),
      mud: Array.from({ length: MUD_N }, () => ({ x: (rnd() - 0.5) * 3.2, y: 0.35 + rnd() * 0.5, z: rnd() > 0.5 ? 0.84 : -0.84, s: 0.05 + rnd() * 0.09 })),
      sparks: Array.from({ length: SPARK_N }, () => ({ x: (rnd() - 0.5) * 3.6, y: 0.3 + rnd() * 1.3, z: (rnd() - 0.5) * 2, ph: rnd() * Math.PI * 2, s: 0.025 + rnd() * 0.03 })),
    };
  }, []);

  const { viewport } = useThree();
  const fit = THREE.MathUtils.clamp(viewport.width / 10, 0.5, 1);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = car.current;
    if (!g) return;

    let x: number;
    let phase: number;
    if (t < T_ARRIVE) {
      x = THREE.MathUtils.lerp(-9, 0, ease(clamp01(t / T_ARRIVE)));
      phase = 0;
    } else if (t < T_GREEN) {
      x = 0;
      phase = 1;
    } else if (t < T_EXIT) {
      const k = clamp01((t - T_GREEN) / (T_EXIT - T_GREEN));
      x = THREE.MathUtils.lerp(0, 10, k * k);
      phase = 2;
    } else {
      x = 10;
      phase = 3;
    }
    g.position.x = x;
    g.position.y = phase === 1 && t < T_WASH ? Math.sin(t * 18) * 0.012 : 0;
    g.rotation.z = phase === 0 ? -0.02 : phase === 2 ? 0.02 : 0;

    const dx = phase === 1 ? 0 : (phase === 0 ? 9 / T_ARRIVE : 10 / (T_EXIT - T_GREEN)) * 0.016;
    wheels.current.forEach((w) => w && (w.rotation.y -= dx * 2.4));

    const wash = t < T_ARRIVE ? 0 : clamp01((t - T_ARRIVE) / (T_WASH - T_ARRIVE));
    const k = ease(wash);
    const m = paint.current;
    if (m) {
      m.color.copy(DIRTY.color).lerp(CLEAN.color, k);
      m.roughness = THREE.MathUtils.lerp(DIRTY.rough, CLEAN.rough, k);
      m.metalness = THREE.MathUtils.lerp(DIRTY.metal, CLEAN.metal, k);
      m.clearcoat = THREE.MathUtils.lerp(DIRTY.clear, CLEAN.clear, k);
    }

    const washing = t >= T_ARRIVE && t < T_WASH;
    const spin = washing ? 0.35 : 0.02;
    brushes.current.forEach((b, i) => b && (b.rotation[i === 4 ? "x" : "y"] += spin));

    // traffic light: red until the wash finishes, then green; gate bar lifts
    const l = light.current;
    if (l) {
      const red = l.getObjectByName("lamp-red") as THREE.Mesh;
      const green = l.getObjectByName("lamp-green") as THREE.Mesh;
      const go = t >= T_WASH;
      (red.material as THREE.MeshStandardMaterial).emissiveIntensity = go ? 0.05 : 2.5 + Math.sin(t * 8) * 0.4;
      (green.material as THREE.MeshStandardMaterial).emissiveIntensity = go ? 3 : 0;
      (red.material as THREE.MeshStandardMaterial).color.set(go ? "#4a1c1c" : "#ff3b3b");
      (green.material as THREE.MeshStandardMaterial).color.set(go ? "#4dff86" : "#2a6b3a");
    }
    if (gate.current) {
      const lift = ease(clamp01((t - T_WASH) / 0.35));
      // bar starts horizontal across the exit (pointing -x) and swings up to vertical
      gate.current.rotation.z = THREE.MathUtils.lerp(Math.PI / 2, 0, lift);
    }

    const md = mud.current;
    if (md) {
      const keep = 1 - k;
      seeds.mud.forEach((s, i) => {
        dummy.position.set(s.x, s.y, s.z);
        dummy.scale.set(s.s * 1.6 * keep, s.s * keep, 0.02);
        dummy.updateMatrix();
        md.setMatrixAt(i, dummy.matrix);
      });
      md.instanceMatrix.needsUpdate = true;
    }

    const f = foam.current;
    if (f) {
      const alive = washing ? Math.sin(Math.PI * wash) : 0;
      seeds.foam.forEach((s, i) => {
        const a = s.a + t * s.sp * 0.6;
        const y = s.y + ((t * s.sp * 0.5 + s.ph) % 1.6);
        dummy.position.set(Math.cos(a) * s.r * 1.6, 0.2 + y, Math.sin(a) * s.r);
        const sc = s.s * alive * (0.7 + 0.3 * Math.sin(t * 6 + s.ph));
        dummy.scale.setScalar(Math.max(0.0001, sc));
        dummy.updateMatrix();
        f.setMatrixAt(i, dummy.matrix);
      });
      f.instanceMatrix.needsUpdate = true;
    }

    const sp = sparks.current;
    if (sp) {
      const on = t >= T_WASH && x < 8 ? 1 : 0;
      seeds.sparks.forEach((s, i) => {
        const tw = Math.max(0, Math.sin(t * 5 + s.ph));
        dummy.position.set(x + s.x, s.y, s.z);
        dummy.scale.setScalar(Math.max(0.0001, s.s * tw * on));
        dummy.rotation.z = t * 2 + s.ph;
        dummy.updateMatrix();
        sp.setMatrixAt(i, dummy.matrix);
      });
      sp.instanceMatrix.needsUpdate = true;
    }

    onProgress(clamp01(t / T_TOTAL), phase);
  });

  return (
    <group scale={fit} position={[0, -0.7 * fit, 0]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={2} />
      <pointLight position={[-4, 3, 3]} intensity={10} color="#E8DCC6" />

      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
        <planeGeometry args={[30, 3.6]} />
        <meshStandardMaterial color="#3a3237" roughness={0.95} />
      </mesh>
      {/* kerbs */}
      {[2.05, -1.65].map((z) => (
        <mesh key={z} position={[0, 0.04, z]}>
          <boxGeometry args={[30, 0.08, 0.14]} />
          <meshStandardMaterial color="#B7A89A" roughness={0.9} />
        </mesh>
      ))}
      {/* centre dashes */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-14 + i * 2, 0.005, 0.2]}>
          <planeGeometry args={[1, 0.08]} />
          <meshBasicMaterial color="#E8DCC6" transparent opacity={0.8} />
        </mesh>
      ))}
      {/* pavement behind */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, -3.2]}>
        <planeGeometry args={[30, 3]} />
        <meshStandardMaterial color="#D9CDBD" roughness={1} />
      </mesh>

      {/* Shop building behind the bay */}
      <group position={[0, 0, -2.4]}>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[6.4, 3.2, 1.2]} />
          <meshStandardMaterial color="#E8DCC6" roughness={0.9} />
        </mesh>
        {/* shutter / doorway */}
        <mesh position={[0, 1.0, 0.61]}>
          <planeGeometry args={[3.6, 2.0]} />
          <meshStandardMaterial color="#2b1d1f" roughness={0.7} />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, 0.12 + i * 0.22, 0.615]}>
            <planeGeometry args={[3.6, 0.03]} />
            <meshBasicMaterial color="#4a383c" />
          </mesh>
        ))}
        {/* sign board */}
        <mesh position={[0, 2.65, 0.63]}>
          <planeGeometry args={[5.6, 1.0]} />
          {sign ? <meshBasicMaterial map={sign} toneMapped={false} /> : <meshStandardMaterial color="#3a3f49" />}
        </mesh>
        {/* awning */}
        <mesh position={[0, 2.1, 0.85]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[6.0, 0.06, 0.6]} />
          <meshStandardMaterial color="#722F37" roughness={0.7} />
        </mesh>
      </group>

      {/* Wash bay (glass) */}
      <group position={[0, 1.05, 0.2]}>
        <mesh>
          <boxGeometry args={[4.4, 2.3, 2.9]} />
          <meshPhysicalMaterial color="#E8DCC6" transparent opacity={0.14} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.4, 2.3, 2.9)]} />
          <lineBasicMaterial color="#722F37" transparent opacity={0.6} />
        </lineSegments>
        {/* corner posts */}
        {[[-2.2, -1.45], [2.2, -1.45], [-2.2, 1.45], [2.2, 1.45]].map(([px, pz], i) => (
          <mesh key={i} position={[px, 0, pz]}>
            <boxGeometry args={[0.06, 2.3, 0.06]} />
            <meshStandardMaterial color="#722F37" />
          </mesh>
        ))}
        {[[-1.85, -1.1], [1.85, -1.1], [-1.85, 1.1], [1.85, 1.1]].map(([bx, bz], i) => (
          <mesh key={i} ref={(el) => { if (el) brushes.current[i] = el; }} position={[bx, -0.15, bz]}>
            <cylinderGeometry args={[0.2, 0.2, 1.8, 10]} />
            <meshStandardMaterial color="#B7A89A" roughness={0.9} transparent opacity={0.85} />
          </mesh>
        ))}
        <mesh ref={(el) => { if (el) brushes.current[4] = el; }} position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 2.0, 10]} />
          <meshStandardMaterial color="#B7A89A" roughness={0.9} />
        </mesh>
      </group>

      {/* Exit: traffic light + boom gate */}
      <TrafficLight refFn={(el) => { light.current = el; }} />
      <group position={[2.75, 0.75, 0.2]}>
        <mesh position={[0, -0.37, 1.45]}>
          <boxGeometry args={[0.16, 0.76, 0.16]} />
          <meshStandardMaterial color="#2b1d1f" />
        </mesh>
        <mesh ref={gate} position={[0, 0, 1.45]}>
          <group position={[0, 0, 0]}>
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[0.07, 2.0, 0.07]} />
              <meshStandardMaterial color="#E8DCC6" />
            </mesh>
            {[0.35, 0.95, 1.55].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <boxGeometry args={[0.075, 0.3, 0.075]} />
                <meshStandardMaterial color="#722F37" />
              </mesh>
            ))}
          </group>
          <boxGeometry args={[0.001, 0.001, 0.001]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      <instancedMesh ref={foam} args={[undefined, undefined, FOAM_N]} frustumCulled={false} position={[0, 0, 0.2]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} />
      </instancedMesh>
      <instancedMesh ref={sparks} args={[undefined, undefined, SPARK_N]} frustumCulled={false} position={[0, 0, 0.2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#fff4d6" transparent opacity={0.95} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>

      {/* Car */}
      <group ref={car} position={[-9, 0, 0.2]}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial ref={paint} color={DIRTY.color} roughness={DIRTY.rough} metalness={DIRTY.metal} clearcoat={0} clearcoatRoughness={0.1} />
        </mesh>
        <mesh position={[0.02, 1.05, 0]}>
          <boxGeometry args={[1.5, 0.36, 1.56]} />
          <meshPhysicalMaterial color="#1a1214" roughness={0.05} metalness={0.3} clearcoat={1} />
        </mesh>
        <instancedMesh ref={mud} args={[undefined, undefined, MUD_N]} frustumCulled={false}>
          <circleGeometry args={[1, 8]} />
          <meshStandardMaterial color="#3b2a1e" roughness={1} side={THREE.DoubleSide} />
        </instancedMesh>
        <mesh position={[1.84, 0.52, 0]}><boxGeometry args={[0.04, 0.22, 0.9]} /><meshStandardMaterial color="#1c1214" /></mesh>
        <mesh position={[1.86, 0.36, 0]}><boxGeometry args={[0.08, 0.14, 1.55]} /><meshStandardMaterial color="#2b1d1f" roughness={0.6} /></mesh>
        <mesh position={[-1.84, 0.36, 0]}><boxGeometry args={[0.08, 0.14, 1.55]} /><meshStandardMaterial color="#2b1d1f" roughness={0.6} /></mesh>
        {[0.52, -0.52].map((z) => (
          <mesh key={`h${z}`} position={[1.83, 0.66, z]}><boxGeometry args={[0.04, 0.12, 0.3]} /><meshStandardMaterial color="#fff6d6" emissive="#ffeab0" emissiveIntensity={2.2} /></mesh>
        ))}
        {[0.55, -0.55].map((z) => (
          <mesh key={`t${z}`} position={[-1.82, 0.66, z]}><boxGeometry args={[0.04, 0.1, 0.28]} /><meshStandardMaterial color="#ff4a4a" emissive="#ff2222" emissiveIntensity={1.4} /></mesh>
        ))}
        {[0.84, -0.84].map((z) => (
          <mesh key={`m${z}`} position={[0.95, 0.95, z]}><boxGeometry args={[0.12, 0.08, 0.14]} /><meshStandardMaterial color="#2b1d1f" roughness={0.5} /></mesh>
        ))}
        {[0.76, -0.76].map((z) => (
          <mesh key={`d${z}`} position={[0.1, 0.62, z]}><boxGeometry args={[1.3, 0.015, 0.012]} /><meshStandardMaterial color="#1c1214" /></mesh>
        ))}
        {[[1.15, 0.78], [1.15, -0.78], [-1.1, 0.78], [-1.1, -0.78]].map(([wx, wz], i) => (
          <Wheel key={i} x={wx} z={wz} refFn={(el) => { if (el) wheels.current[i] = el; }} />
        ))}
      </group>
    </group>
  );
}

export function WashScene({ onProgress }: { onProgress: (p: number, phase: number) => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0.6, 2.6, 8.6], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.9, 0)}
    >
      <Scene onProgress={onProgress} />
    </Canvas>
  );
}
