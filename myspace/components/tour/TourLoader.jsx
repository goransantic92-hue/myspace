"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";
import { BRAND } from "@/lib/brand";

function Header({ children }) {
  return (
    <div className="flex items-end justify-between gap-4 px-5 md:px-8">
      <span className="shrink-0 font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]">
        {BRAND}
      </span>
      <span className="ml-auto text-right font-sans text-[clamp(0.75rem,1.5vw,1rem)] font-normal uppercase leading-tight tracking-[0.12em] text-[#EDE6D6]/70">
        Private Residence Tour
      </span>
      {children}
    </div>
  );
}

const retryClass =
  "mx-5 mt-4 rounded-full border border-[#EDE6D6]/60 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] md:mx-8";

export class TourErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error("Tour failed to load:", err);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="fixed inset-0 z-[300] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]" role="alert">
        <div className="w-full">
          <Header />
          <div className="mt-7 h-[3px] w-full bg-[#EDE6D6]/10" />
          <p className="mt-6 px-5 text-[10px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 md:px-8">
            Some files could not load
          </p>
          <button type="button" onClick={() => window.location.reload()} className={retryClass}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}

export function ReadySignal({ onReady }) {
  useEffect(() => {
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => onReady());
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [onReady]);
  return null;
}

export default function TourLoader({ ready = false }) {
  const { progress, errors } = useProgress();
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const counter = useRef({ value: 0 });
  const maxProgress = useRef(0);
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const failed = errors.length > 0;

  const render = useCallback(() => {
    const value = counter.current.value;
    if (barRef.current) gsap.set(barRef.current, { scaleX: value / 100 });
    setPercent(Math.round(value));
  }, []);

  useEffect(() => {
    if (ready) return;
    maxProgress.current = Math.max(maxProgress.current, progress);
    gsap.to(counter.current, {
      value: Math.min(maxProgress.current, 99),
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      onUpdate: render,
    });
  }, [progress, ready, render]);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.to(counter.current, { value: 100, duration: 0.3, ease: "power2.out", overwrite: true, onUpdate: render }).to(
      rootRef.current,
      { opacity: 0, duration: 0.7, ease: "power2.inOut" },
    );
    return () => tl.kill();
  }, [ready, render]);

  useEffect(() => {
    const target = counter.current;
    return () => gsap.killTweensOf(target);
  }, []);

  if (done) return null;

  const status = failed
    ? "Some files could not load"
    : ready
      ? "Entering the residence"
      : "Preparing your tour experience";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]"
      role="status"
      aria-live="polite"
    >
      <div className="w-full">
        <Header>
          <span className="shrink-0 font-sans text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
            {String(percent).padStart(2, "0")}
          </span>
        </Header>
        <div className="mt-7 h-[3px] w-full overflow-hidden bg-[#EDE6D6]/10">
          <div
            ref={barRef}
            className="h-full origin-left bg-[#EDE6D6] will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 px-5 md:px-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#EDE6D6]/60">{status}</p>
          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-[#EDE6D6]/40 sm:block">
            ARCHITECTURE · INTERIORS · DETAILS
          </span>
        </div>
        {failed && (
          <button type="button" onClick={() => window.location.reload()} className={`pointer-events-auto ${retryClass}`}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
