"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

/*
 * Footer backdrop: a full-width 3D "blueprint" coupé (same silhouette as the cursor / drive-across car),
 * drawn as glowing edges over a faint glass body, cruising on a scrolling grid road with speed streaks
 * and a detailing scan-light sweeping over it. Renders only while the footer is on screen.
 */

type Palette = { body: string; glass: string; wheel: string; grid: string; light: string; tail: string; fill: string };
const LIGHT: Palette = { body: "#722F37", glass: "#8a5a5f", wheel: "#5e4b45", grid: "#722F37", light: "#c8783f", tail: "#d63447", fill: "#722F37" };
const DARK: Palette = { body: "#e8dcc6", glass: "#b7a89a", wheel: "#b7a89a", grid: "#b7a89a", light: "#e9a970", tail: "#ff4b5e", fill: "#e8dcc6" };

/* SVG profile coords (viewBox 240×80, ground ≈ y70) → world units, car ≈ 8 long */
const P = (sx: number, sy: number) => new THREE.Vector2((sx - 120) / 28, (70 - sy) / 28);
const WHEEL_R = 13.5 / 28;
const ARCH_R = 17.6 / 28;
const WHEEL_X = [P(58, 0).x, P(186, 0).x];
const WHEEL_Y = P(0, 60).y;
const BODY_W = 3.3;
const CABIN_W = 2.5;

function bodyShape() {
  const s = new THREE.Shape();
  const m = (x: number, y: number) => P(x, y);
  let v = m(14, 58);
  s.moveTo(v.x, v.y);
  for (const [x, y] of [[10, 55], [8, 46]]) {
    v = m(x, y);
    s.lineTo(v.x, v.y);
  }
  const q1 = m(8, 38), q2 = m(16, 36);
  s.quadraticCurveTo(q1.x, q1.y, q2.x, q2.y);
  for (const [x, y] of [[32, 34], [60, 31.5], [170, 29]]) {
    v = m(x, y);
    s.lineTo(v.x, v.y);
  }
  const b1 = m(192, 32), b2 = m(214, 36), b3 = m(228, 42);
  s.bezierCurveTo(b1.x, b1.y, b2.x, b2.y, b3.x, b3.y);
  const q3 = m(235, 46), q4 = m(232, 52);
  s.quadraticCurveTo(q3.x, q3.y, q4.x, q4.y);
  v = m(228, 58);
  s.lineTo(v.x, v.y);
  const front = m(186, 58), rear = m(58, 58);
  s.absarc(front.x, front.y, ARCH_R, 0, Math.PI, false);
  s.absarc(rear.x, rear.y, ARCH_R, 0, Math.PI, false);
  s.closePath();
  return s;
}

function cabinShape() {
  const s = new THREE.Shape();
  const a = P(58, 32), c1 = P(80, 21), c2 = P(98, 15), top = P(118, 13.5), c3 = P(138, 13), c4 = P(152, 18), end = P(168, 30);
  s.moveTo(a.x, a.y);
  s.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, top.x, top.y);
  s.bezierCurveTo(c3.x, c3.y, c4.x, c4.y, end.x, end.y);
  s.closePath();
  return s;
}

function extrude(shape: THREE.Shape, depth: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 40 });
  g.translate(0, 0, -depth / 2);
  return g;
}

/* a curve drawn on both flanks of the car */
function flankLine(pts: [number, number][], z: number) {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(P(x, y).x, P(x, y).y, z)));
  const p = curve.getPoints(60);
  // as segment pairs so it renders with <lineSegments> (JSX <line> collides with the SVG element type)
  return new THREE.BufferGeometry().setFromPoints(p.slice(1).flatMap((b, i) => [p[i], b]));
}

function Car({ pal, motion, pointer }: { pal: Palette; motion: number; pointer: React.RefObject<{ x: number; y: number }> }) {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);

  const geo = useMemo(() => {
    const body = extrude(bodyShape(), BODY_W);
    const cabin = extrude(cabinShape(), CABIN_W);
    const tire = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.5, 48, 1, true).rotateX(Math.PI / 2);
    const tireEdges = new THREE.EdgesGeometry(new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.5, 48).rotateX(Math.PI / 2), 20);
    // rim: ring + 5 twin spokes
    const rimPts: THREE.Vector3[] = [];
    const rr = WHEEL_R * 0.7;
    for (let i = 0; i < 64; i++) {
      const a0 = (i / 64) * Math.PI * 2, a1 = ((i + 1) / 64) * Math.PI * 2;
      rimPts.push(new THREE.Vector3(Math.cos(a0) * rr, Math.sin(a0) * rr, 0), new THREE.Vector3(Math.cos(a1) * rr, Math.sin(a1) * rr, 0));
    }
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      for (const off of [-0.09, 0.09]) {
        rimPts.push(new THREE.Vector3(Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0), new THREE.Vector3(Math.cos(a + off) * rr, Math.sin(a + off) * rr, 0));
      }
    }
    const rim = new THREE.BufferGeometry().setFromPoints(rimPts);
    const z = BODY_W / 2 + 0.005;
    const flanks = [z, -z].flatMap((zz) => [
      flankLine([[26, 41], [80, 38.5], [150, 37.5], [224, 44]], zz), // character line
      flankLine([[80, 54], [124, 54.5], [164, 54]], zz), // skirt
      flankLine([[112, 31], [110.5, 42], [109, 54]], zz), // door seam
    ]);
    const head = [z - 0.25, -(z - 0.25)].map((zz) => flankLine([[212, 39.5], [222, 41.2], [229, 43.2]], zz));
    const tail = [z - 0.15, -(z - 0.15)].map((zz) => flankLine([[8.5, 41], [15, 39.8], [22, 38.6]], zz));
    return {
      body,
      bodyEdges: new THREE.EdgesGeometry(body, 28),
      cabin,
      cabinEdges: new THREE.EdgesGeometry(cabin, 28),
      tire,
      tireEdges,
      rim,
      flanks,
      head,
      tail,
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(geo).flat().forEach((g) => (g as THREE.BufferGeometry).dispose());
    },
    [geo],
  );

  useFrame(({ clock }, delta) => {
    const g = root.current;
    if (!g) return;
    const t = clock.elapsedTime * motion;
    const k = 1 - Math.exp(-delta * 2.5);
    const p = pointer.current ?? { x: 0, y: 0 };
    // 3/4 hero angle, breathing a little, steered by the pointer
    g.rotation.y += (-0.3 + Math.sin(t * 0.25) * 0.08 + p.x * 0.18 - g.rotation.y) * k;
    g.rotation.x += (0.06 + p.y * 0.05 - g.rotation.x) * k;
    g.position.y = Math.sin(t * 3.1) * 0.012 * motion; // suspension hum
    wheels.current.forEach((w) => w && (w.rotation.z -= delta * 6 * motion));
  });

  const line = (color: string, opacity: number) => (
    <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  );

  return (
    <group ref={root}>
      {/* faint glass body for volume */}
      <mesh geometry={geo.body}>
        <meshBasicMaterial color={pal.fill} transparent opacity={0.025} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geo.cabin}>
        <meshBasicMaterial color={pal.glass} transparent opacity={0.04} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={geo.bodyEdges}>{line(pal.body, 0.3)}</lineSegments>
      <lineSegments geometry={geo.cabinEdges}>{line(pal.glass, 0.22)}</lineSegments>
      {geo.flanks.map((g, i) => (
        <lineSegments key={i} geometry={g}>{line(pal.body, 0.14)}</lineSegments>
      ))}
      {geo.head.map((g, i) => (
        <lineSegments key={`h${i}`} geometry={g}>{line(pal.light, 1)}</lineSegments>
      ))}
      {geo.tail.map((g, i) => (
        <lineSegments key={`t${i}`} geometry={g}>{line(pal.tail, 1)}</lineSegments>
      ))}

      {/* wheels */}
      {/* near-side wheels get the full rim; far-side ones are just a ghost so the axles don't read as clutter */}
      {WHEEL_X.flatMap((x) => [BODY_W / 2 - 0.3, -(BODY_W / 2 - 0.3)].map((z) => [x, z] as const)).map(([x, z], i) => {
        const near = z > 0;
        return (
          <group key={i} position={[x, WHEEL_Y, z]}>
            <mesh geometry={geo.tire}>
              <meshBasicMaterial color={pal.wheel} transparent opacity={near ? 0.05 : 0.02} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <lineSegments geometry={geo.tireEdges}>{line(pal.wheel, near ? 0.3 : 0.08)}</lineSegments>
            {near && (
              <group ref={(el) => void (wheels.current[i] = el)} position={[0, 0, 0.26]}>
                <lineSegments geometry={geo.rim}>{line(pal.body, 0.32)}</lineSegments>
              </group>
            )}
          </group>
        );
      })}

      <ScanLight color={pal.light} motion={motion} />
    </group>
  );
}

/* a sheet of light that sweeps nose → tail, like a detailing inspection lamp */
function ScanLight({ color, motion }: { color: string; motion: number }) {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const mesh = m.current;
    if (!mesh) return;
    const cycle = (clock.elapsedTime * motion * 0.22) % 1; // ~4.5s loop, sweep in first 60%
    const s = Math.min(cycle / 0.6, 1);
    mesh.position.x = THREE.MathUtils.lerp(4.6, -4.6, s);
    (mesh.material as THREE.MeshBasicMaterial).opacity = motion === 0 ? 0 : Math.sin(Math.PI * s) * 0.12;
  });
  return (
    <mesh ref={m} rotation={[0, Math.PI / 2, 0]} position={[0, 0.9, 0]}>
      <planeGeometry args={[BODY_W + 0.8, 2.6]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* grid road that scrolls under the car (car faces +x, so the road runs toward −x) */
const roadVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const roadFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * vec2(40.0, 16.0);
    p.x += uTime * 3.0;
    vec2 g = abs(fract(p) - 0.5);
    float lw = 0.02;
    float line = 1.0 - smoothstep(lw, lw + 0.025, min(g.x, g.y));
    float fade = smoothstep(0.42, 0.0, distance(vUv, vec2(0.5)));
    gl_FragColor = vec4(uColor, line * fade * 0.08);
    #include <colorspace_fragment>
  }
`;

function Road({ color, motion }: { color: string; motion: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }), [color]);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime * motion;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WHEEL_Y - WHEEL_R - 0.01, 0]}>
      <planeGeometry args={[40, 16]} />
      <shaderMaterial ref={mat} vertexShader={roadVert} fragmentShader={roadFrag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}

/* long light streaks rushing past in the background */
function Streaks({ color, motion }: { color: string; motion: number }) {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ y: -0.6 + ((i * 37) % 23) / 7, z: -2.5 - (i % 4) * 1.2, x: ((i * 53) % 30) - 15, len: 1.2 + (i % 5) * 0.6, v: 6 + (i % 3) * 3 })),
    [],
  );
  useFrame((_, delta) => {
    group.current?.children.forEach((c, i) => {
      c.position.x -= seeds[i].v * delta * motion;
      if (c.position.x < -16) c.position.x = 16;
    });
  });
  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <planeGeometry args={[s.len, 0.012]} />
          <meshBasicMaterial color={color} transparent opacity={0.14} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  // car spans ~85% of the footer width, capped so it never overflows a short footer
  const s = Math.min(viewport.width / 10.5, viewport.height / 3.3);
  return (
    <group scale={s} position={[0, -viewport.height * 0.06, 0]}>
      {children}
    </group>
  );
}

export function FooterCar({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const pal = resolvedTheme === "dark" ? DARK : LIGHT;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const motion = reducedMotion ? 0 : 1;
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.6, 10], fov: 38 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        frameloop={!visible ? "never" : reducedMotion ? "demand" : "always"}
        className="pointer-events-none"
      >
        <Rig>
          <Streaks color={pal.grid} motion={motion} />
          <Road color={pal.grid} motion={motion} />
          <Car pal={pal} motion={motion} pointer={pointer} />
        </Rig>
      </Canvas>
    </div>
  );
}
