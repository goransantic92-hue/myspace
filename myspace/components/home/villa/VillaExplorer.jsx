"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls, Environment } from "@react-three/drei";
import VillaModel from "./VillaModel";
import { HandClickIcon, Rotate3dIcon } from "@/components/layout/icons";

const STEPS = [
  { label: "Full View", stat: "Complete building overview" },
  { label: "Walls", stat: "Reinforced concrete shell" },
  { label: "Floor", stat: "Marble Carrara White finish" },
  { label: "Roof", stat: "Insulated flat roof system" },
  { label: "Pillars", stat: "Structural load-bearing columns" },
  { label: "Stairs", stat: "Oak-finished staircase" },
  { label: "Windows & Doors", stat: "Chrome-framed glazing" },
];

const pad = (n) => String(n).padStart(2, "0");

const CAMERA_VIEWS = {
  full: { pos: [2.3, 2.3, 16.9], targetOffset: [1.2, 0, -5.4] },
  0: { pos: [-5.3, 15.4, 16.2], targetOffset: [1.4, -0.2, -1.6] },
  1: { pos: [18, 7.6, 9.4], targetOffset: [5.8, -3, -3] },
  2: { pos: [4.2, 14.5, 14.5], targetOffset: [4.3, 3.4, 3.4] },
  3: { pos: [-1, 16.2, 11.9], targetOffset: [5.8, -12.6, -10.4] },
  4: { pos: [11.1, 4.2, -15.6], targetOffset: [-1.6, -8.9, 7.3] },
  5: { pos: [-11.3, 3.3, -19], targetOffset: [-0.099, -5.3, -6.7] },
};

const SKY = [
  "/assets/textures/sky/px.png",
  "/assets/textures/sky/nx.png",
  "/assets/textures/sky/py.png",
  "/assets/textures/sky/ny.png",
  "/assets/textures/sky/pz.png",
  "/assets/textures/sky/nz.png",
];

const MOUSE_BUTTONS = { left: 1, middle: 0, right: 0, wheel: 0 };

function ResponsiveFov() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.fov = size.width < 768 ? 75 : 50;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

function VillaScene({ activeGroupIndex, visible }) {
  const controls = useRef();
  const groupRef = useRef();
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (!groupRef.current || center) return;
    setCenter(new THREE.Box3().setFromObject(groupRef.current).getCenter(new THREE.Vector3()));
  }, [center]);

  useEffect(() => {
    if (!center || !controls.current) return;
    const view = CAMERA_VIEWS[activeGroupIndex] || CAMERA_VIEWS.full;
    const c = center.toArray();
    const pos = view.pos.map((v, i) => v + c[i]);
    const target = view.targetOffset.map((v, i) => v + c[i]);
    controls.current.setLookAt(...pos, ...target, true);
  }, [activeGroupIndex, center]);

  return (
    <>
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Environment files={SKY} background />
      <group ref={groupRef}>
        <VillaModel activeGroupIndex={activeGroupIndex} />
      </group>
      <CameraControls ref={controls} enabled={visible} mouseButtons={MOUSE_BUTTONS} />
    </>
  );
}

export default function VillaExplorer({
  visible = false,
  animationActive = false,
  activeGroupIndex = "full",
  onGroupSelect = () => {},
  progressRef,
}) {
  const stepIndex = activeGroupIndex === "full" ? 0 : activeGroupIndex + 1;
  const total = STEPS.length;
  const step = STEPS[stepIndex];

  const rootRef = useRef(null);
  const hudRef = useRef(null);
  const railFillRef = useRef(null);
  const barFillRef = useRef(null);
  const knobRef = useRef(null);
  const [interactive, setInteractive] = useState(false);
  const hintsShown = useRef({ rotate: false, click: false });

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (not ((orientation: landscape) and (max-height: 500px)))",
    );
    const update = () => setInteractive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const render = () => {
      const p = gsap.utils.clamp(0, 1, progressRef?.current ?? 0);
      const rail = gsap.utils.clamp(0, 1, (p * total - 0.5) / (total - 1));
      if (railFillRef.current) railFillRef.current.style.transform = `scaleY(${rail})`;
      if (barFillRef.current) barFillRef.current.style.transform = `scaleX(${p})`;
      if (knobRef.current) knobRef.current.style.left = `${100 * p}%`;
    };
    render();
    if (animationActive) {
      gsap.ticker.add(render);
      return () => gsap.ticker.remove(render);
    }
  }, [animationActive, progressRef, total]);

  useEffect(() => {
    if (!visible || !hudRef.current) return;
    const texts = hudRef.current.querySelectorAll("[data-hud-text]");
    const tween = gsap.fromTo(
      texts,
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 },
    );
    return () => tween.kill();
  }, [stepIndex, visible]);

  useEffect(() => {
    if (!visible) hintsShown.current = { rotate: false, click: false };
  }, [visible]);

  useEffect(() => {
    if (!visible || !rootRef.current) return;
    const kind = stepIndex === 1 ? "rotate" : stepIndex === 2 ? "click" : null;
    if (!kind || hintsShown.current[kind]) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.5,
        onComplete: () => {
          hintsShown.current[kind] = true;
        },
      });
      if (kind === "click") {
        tl.fromTo(".rail-hint", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0)
          .to(".rail-hint-icon", { x: 6, duration: 0.35, repeat: 5, yoyo: true, ease: "power1.inOut" }, 0)
          .fromTo(".rail-hint-ring", { scale: 1, opacity: 0.6 }, { scale: 2, opacity: 0, duration: 0.7, repeat: 2, ease: "power1.out" }, 0)
          .to(".rail-hint", { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" }, 2.1);
      } else {
        tl.fromTo(".rotate-hint", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0)
          .to(".rotate-hint-icon", { rotation: 360, duration: 1.4, repeat: 2, ease: "power1.inOut" }, 0)
          .to(".rotate-hint", { opacity: 0, y: 10, duration: 0.5, ease: "power2.in" }, 4.2);
      }
    }, rootRef);
    return () => ctx.revert();
  }, [visible, stepIndex]);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 z-[30] overflow-hidden bg-blue-900 transition-opacity duration-700 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!visible}
    >
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        dpr={[1, 1.5]}
        frameloop={visible && animationActive ? "always" : "demand"}
        gl={{ powerPreference: "high-performance" }}
        style={{ pointerEvents: visible && interactive ? "auto" : "none" }}
      >
        <ResponsiveFov />
        <VillaScene activeGroupIndex={activeGroupIndex} visible={visible} />
      </Canvas>

      <div className="pointer-events-none absolute right-4 top-[38%] z-10 -translate-y-1/2 scale-90 lg:right-10 lg:top-1/2 lg:scale-100">
        <div className="pointer-events-auto relative flex flex-col items-center gap-4">
          <div className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-white/20" />
          <div
            ref={railFillRef}
            className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px origin-top -translate-x-1/2"
            style={{
              transform: "scaleY(0)",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 8px rgba(255,255,255,0.45)",
            }}
          />
          {STEPS.map((s, i) => {
            const current = i === stepIndex;
            const past = i < stepIndex;
            return (
              <button
                key={s.label}
                type="button"
                title={s.label}
                aria-label={`Show ${s.label}`}
                aria-current={current}
                onClick={() => onGroupSelect(i === 0 ? "full" : i - 1)}
                className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full cursor-pointer"
              >
                <span
                  className={`block rounded-full border transition-all duration-300 ${current ? "h-3.5 w-3.5 border-white ring-4 ring-white/20" : past ? "h-2 w-2 border-white/80" : "h-2 w-2 border-white/40"}`}
                  style={{
                    backgroundColor: current
                      ? "#ffffff"
                      : past
                        ? "rgba(255,255,255,0.8)"
                        : "transparent",
                  }}
                />
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className="rail-hint pointer-events-none absolute -right-4 top-1/2 -mt-[18px] mr-4 flex h-9 w-9 items-center justify-center opacity-0"
          >
            <span className="rail-hint-ring absolute inset-0 rounded-full bg-white/60" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2725] shadow-lg">
              <HandClickIcon className="rail-hint-icon text-xl" />
            </span>
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 hidden justify-center lg:flex">
        <div
          aria-hidden="true"
          className="rotate-hint flex flex-col items-center gap-2 text-white opacity-0"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm">
            <Rotate3dIcon className="rotate-hint-icon text-2xl" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">
            Drag to rotate
          </span>
        </div>
      </div>

      <div
        ref={hudRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-6 pb-6 pt-20 text-white lg:px-10 lg:pb-8 lg:pt-28"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 pr-10 lg:pr-0" role="status" aria-live="polite">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
              <span className="h-px w-6 bg-white/60" />
              <span>Structure</span>
            </div>
            <div className="overflow-hidden pb-[0.15em]">
              <h3
                data-hud-text
                className="font-sans text-3xl leading-none tracking-[-0.04em] md:text-4xl lg:text-6xl"
              >
                {step.label}
              </h3>
            </div>
            <div className="mt-3 overflow-hidden">
              <p
                data-hud-text
                className="max-w-md text-xs uppercase tracking-[0.14em] text-white/75 md:text-sm"
              >
                {step.stat}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="overflow-hidden pb-[0.1em]">
              <div
                data-hud-text
                className="font-sans text-4xl leading-none tracking-[-0.05em] tabular-nums md:text-5xl lg:text-8xl"
              >
                {pad(stepIndex + 1)}
              </div>
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
              of {pad(total)}
            </div>
          </div>
        </div>
        <div className="relative mt-6 h-[2px] w-full bg-white/25">
          <div
            ref={barFillRef}
            className="absolute inset-0 origin-left"
            style={{ transform: "scaleX(0)", backgroundColor: "#ffffff" }}
          />
          {Array.from({ length: total - 1 }, (_, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/50"
              style={{ left: `${((i + 1) / total) * 100}%` }}
            />
          ))}
          <span
            ref={knobRef}
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer"
            style={{
              left: "0%",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 10px rgba(255,255,255,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
