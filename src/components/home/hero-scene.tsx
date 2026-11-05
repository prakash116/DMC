"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type SceneSlide = { id: string; video: string; poster: string };

type Props = {
  slides: SceneSlide[];
  active: number;
  dir: 1 | -1;
};

/* Card geometry: portrait reel, 478x850. The plane is padded so the shader can draw a soft shadow around the card. */
const CARD_W = 1.25;
const CARD_H = CARD_W * (850 / 478);
const PAD = 0.6;
const PLANE_W = CARD_W + PAD * 2;
const PLANE_H = CARD_H + PAD * 2;

/* Rounded-rect alpha mask + subtle inner vignette so edges read as glass, not a flat plane */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const frag = /* glsl */ `
  uniform sampler2D map;
  uniform float opacity;
  uniform float dim;
  uniform vec2 size;   // card size
  uniform vec2 plane;  // padded plane size
  uniform float radius;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * plane;          // plane-space position, card centred
    vec2 tuv = clamp(p / size + 0.5, 0.0, 1.0);
    float d = roundedBox(p, size * 0.5, radius);
    float aa = fwidth(d) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, d);

    // Soft drop shadow: offset down, burgundy-black, wider + stronger on the active card
    float ds = roundedBox(p - vec2(0.0, -0.12), size * 0.5, radius);
    float spread = mix(0.38, 0.22, dim);
    float shadow = pow(1.0 - smoothstep(-0.02, spread, ds), 1.8) * mix(0.3, 0.12, dim);
    shadow *= (1.0 - mask);

    vec4 tex = texture2D(map, tuv);
    // inactive cards: keep the image readable, just a gentle latte veil + slight desaturation
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 desat = mix(tex.rgb, vec3(lum), dim * 0.5);
    vec3 col = mix(desat, vec3(0.718, 0.659, 0.604), dim * 0.35);

    // glass bezel: a soft inner band that lightens toward the edge, plus a crisp hairline
    float bezel = 1.0 - smoothstep(0.0, 0.07, abs(d));
    col = mix(col, vec3(0.93, 0.89, 0.82), bezel * 0.28);
    float hair = 1.0 - smoothstep(0.0, 0.012, abs(d));
    col = mix(col, vec3(1.0), hair * 0.6);
    // top-left light sheen on the active card
    float sheen = smoothstep(0.2, 0.9, 1.0 - (tuv.x * 0.6 + (1.0 - tuv.y) * 0.4)) * (1.0 - dim);
    col += sheen * 0.06;

    vec3 shadowCol = vec3(0.16, 0.07, 0.09);
    vec3 outCol = mix(shadowCol, col, mask);
    float alpha = max(mask, shadow) * opacity;

    gl_FragColor = vec4(outCol, alpha);
    #include <colorspace_fragment>
  }
`;

type Media = {
  video: HTMLVideoElement;
  videoTex: THREE.VideoTexture;
  posterTex: THREE.Texture;
  map: THREE.Texture; // texture the frame loop should currently show
};

function Card({
  slide,
  offset,
  isActive,
  parallax,
}: {
  slide: SceneSlide;
  offset: number; // -1, 0, 1, 2 … relative to active
  isActive: boolean;
  parallax: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const media = useRef<Media | null>(null);

  // Initial uniform values; mutated afterwards only through mat.current
  const uniforms = useMemo(
    () => ({
      map: { value: null as THREE.Texture | null },
      opacity: { value: 1 },
      dim: { value: 0 },
      size: { value: new THREE.Vector2(CARD_W, CARD_H) },
      plane: { value: new THREE.Vector2(PLANE_W, PLANE_H) },
      radius: { value: 0.12 },
    }),
    [],
  );

  // Create the video element + textures once; poster shows until the video plays
  useEffect(() => {
    const video = document.createElement("video");
    video.src = slide.video;
    video.poster = slide.poster;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    const videoTex = new THREE.VideoTexture(video);
    videoTex.colorSpace = THREE.SRGBColorSpace;
    const posterTex = new THREE.TextureLoader().load(slide.poster);
    posterTex.colorSpace = THREE.SRGBColorSpace;
    media.current = { video, videoTex, posterTex, map: posterTex };
    return () => {
      video.pause();
      video.removeAttribute("src");
      videoTex.dispose();
      posterTex.dispose();
      media.current = null;
    };
  }, [slide.video, slide.poster]);

  useEffect(() => {
    const m = media.current;
    if (!m) return;
    if (isActive) {
      m.video.currentTime = 0;
      m.video
        .play()
        .then(() => {
          m.map = m.videoTex;
        })
        .catch(() => {});
    } else {
      m.video.pause();
      m.map = m.posterTex;
    }
  }, [isActive]);

  // Target pose on the arc
  const target = useMemo(() => {
    const a = THREE.MathUtils.clamp(offset, -2, 2);
    return {
      x: a * 1.15,
      y: 0,
      z: -Math.abs(a) * 0.9,
      ry: -a * 0.6,
      s: a === 0 ? 1 : 0.86,
      dim: a === 0 ? 0 : 1,
      op: Math.abs(a) >= 2 ? 0 : 1,
    };
  }, [offset]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const k = 1 - Math.exp(-delta * 7); // frame-rate independent damping
    m.position.x += (target.x - m.position.x) * k;
    m.position.z += (target.z - m.position.z) * k;
    m.rotation.y += (target.ry + parallax.current.x * 0.12 - m.rotation.y) * k;
    m.rotation.x += (-parallax.current.y * 0.08 - m.rotation.x) * k;
    const s = m.scale.x + (target.s - m.scale.x) * k;
    m.scale.setScalar(s);
    const u = mat.current?.uniforms;
    if (!u) return;
    if (media.current && u.map.value !== media.current.map) u.map.value = media.current.map;
    u.dim.value += (target.dim - u.dim.value) * k;
    u.opacity.value += (target.op - u.opacity.value) * k;
  });

  return (
    <mesh ref={mesh} position={[target.x, 0, target.z]} renderOrder={offset === 0 ? 2 : 1}>
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent />
    </mesh>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  // Fit: the active card fills ~85% of the canvas height, unless width is the tighter constraint
  const s = Math.min(viewport.height / (CARD_H * 1.15), viewport.width / 3.4);
  return <group scale={s}>{children}</group>;
}

export function HeroScene({ slides, active }: Props) {
  const parallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      parallax.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      parallax.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const n = slides.length;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 32 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <Rig>
        {slides.map((s, i) => {
          // shortest signed distance on the ring
          let off = i - active;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          return <Card key={s.id} slide={s} offset={off} isActive={i === active} parallax={parallax} />;
        })}
      </Rig>
    </Canvas>
  );
}
