"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DeviceRotateIcon } from "@/components/layout/icons";
import Logo from "@/components/layout/Logo";

gsap.registerPlugin(useGSAP);

function animate() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.from(".lock-line", { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.1 });
  gsap.from(".lock-badge", { opacity: 0, scale: 0.8, duration: 0.7, ease: "back.out(1.8)" });
  if (reduced) return;
  gsap.to(".lock-icon", {
    rotation: 90,
    duration: 0.9,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
    repeatDelay: 0.8,
  });
  gsap.fromTo(
    ".lock-ring",
    { scale: 1, opacity: 0.5 },
    { scale: 1.8, opacity: 0, duration: 1.8, ease: "power1.out", repeat: -1 },
  );
}

export default function RotateWarning() {
  const ref = useRef(null);
  useGSAP(animate, { scope: ref });

  return (
    <div
      ref={ref}
      className="rotate-device-warning fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-blue-900 text-white"
      role="alert"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="relative px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-lg tracking-tight">
        <Logo />
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="lock-badge relative mb-10 flex h-24 w-24 items-center justify-center">
          <span className="lock-ring absolute inset-0 rounded-full bg-white/40" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm">
            <DeviceRotateIcon className="lock-icon text-4xl" />
          </span>
        </div>
        <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
          <span className="h-px w-6 bg-white/60" />
          <span>Landscape mode</span>
          <span className="h-px w-6 bg-white/60" />
        </div>
        <h2 className="font-serif text-[clamp(2.25rem,10vw,3.5rem)] leading-[96%]">
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="lock-line block">Turn your device,</span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="lock-line block">sideways.</span>
          </span>
        </h2>
        <p className="mt-6 max-w-xs text-xs uppercase leading-[1.7] tracking-[0.14em] text-white/75">
          <span className="block overflow-hidden">
            <span className="lock-line block">This 3D interior experience is built for landscape mode.</span>
          </span>
        </p>
      </div>
      <div className="relative h-[max(1.5rem,env(safe-area-inset-bottom))]" />
    </div>
  );
}
