"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uTexSize;
  uniform float uTime;
  uniform float uProgress;

  float random(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 texSize = max(uTexSize, vec2(1.0));
    float scale = max(uResolution.x / texSize.x, uResolution.y / texSize.y);
    vec2 scaledTex = texSize * scale;
    vec2 offset = (scaledTex - uResolution) * 0.5;
    vec2 texUV = (frag + offset) / scaledTex;

    vec2 uv = frag / uResolution.xy;
    vec2 noiseUV = uv * vec2(uResolution.x / uResolution.y, 1.0);
    float ink = fbm(noiseUV * 2.0 + uTime * 0.16);
    float threshold = smoothstep(0.0, 1.0, ink - (1.0 - uProgress * 1.2));
    float alpha = 1.0 - threshold;

    vec4 color = texture2D(uTexture, texUV);
    gl_FragColor = vec4(color.rgb, color.a * alpha);
  }
`;

export default function InkDissolveOverlay({ image = "", progressRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "default",
      });
    } catch (err) {
      console.error("InkDissolveOverlay: WebGL initialization failed.", err);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "100vw",
      height: "100vh",
      display: "block",
    });
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTexture: { value: null },
      uResolution: { value: new THREE.Vector2() },
      uTexSize: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    };
    const texture = new THREE.TextureLoader().load(image, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      uniforms.uTexSize.value.set(tex.image.width, tex.image.height);
    });
    uniforms.uTexture.value = texture;
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const w = Math.max(window.innerWidth, 1);
      const h = Math.max(window.innerHeight, 1);
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf;
    const loop = (t) => {
      uniforms.uTime.value = 0.001 * t;
      uniforms.uProgress.value = progressRef?.current ?? 0;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [image, progressRef]);

  return (
    <div
      ref={hostRef}
      className="marquee-canvas pointer-events-none absolute left-1/2 top-1/2 z-40 h-[28vh] w-[min(70vw,18rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm lg:h-[38vh] lg:w-[min(72vw,24rem)]"
      aria-hidden="true"
    />
  );
}
