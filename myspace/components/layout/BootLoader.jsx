"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Logo from "./Logo";

const ASSETS = [
  { type: "image", src: "/assets/images/hero5.webp", weight: 1 },
  { type: "image", src: "/assets/images/cloud-1-cropped-beige.webp", weight: 1 },
  { type: "image", src: "/assets/images/cloud-2-full-beige.webp", weight: 1 },
  { type: "binary", src: "/assets/models/vill_draco.glb", weight: 4 },
];

async function loadBinary(src, onProgress) {
  const res = await fetch(src, { cache: "force-cache" });
  if (!res.ok) throw Error(`Unable to load ${src}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body || !total) {
    await res.arrayBuffer();
    onProgress(1);
    return;
  }
  const reader = res.body.getReader();
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    loaded += value.length;
    onProgress(Math.min(loaded / total, 0.99));
  }
  onProgress(1);
}

function loadImage(src, onProgress) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      onProgress(1);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

function Loader({ children }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const progress = useRef({ value: 0 });
  const [done, setDone] = useState(false);
  const [percent, setPercent] = useState(0);

  const render = useCallback(() => {
    const v = progress.current.value;
    if (barRef.current) gsap.set(barRef.current, { scaleX: v / 100 });
    setPercent(Math.round(v));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    progress.current.value = 0;
    render();

    const weights = [1, ...ASSETS.map((a) => a.weight)];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const parts = weights.map(() => 0);
    const report = (index, value) => {
      if (cancelled) return;
      parts[index] = Math.max(parts[index], value);
      const pct =
        (parts.reduce((acc, p, i) => acc + p * weights[i], 0) / totalWeight) *
        100;
      gsap.to(progress.current, {
        value: pct,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onUpdate: render,
      });
    };

    Promise.all([
      document.fonts.ready.catch(() => {}).finally(() => report(0, 1)),
      ...ASSETS.map((asset, i) => {
        const onProgress = (v) => report(i + 1, v);
        return (
          asset.type === "image"
            ? loadImage(asset.src, onProgress)
            : loadBinary(asset.src, onProgress)
        )
          .catch((err) => {
            console.warn(`Failed to preload asset: ${asset.src}`, err);
          })
          .finally(() => report(i + 1, 1));
      }),
    ]).then(() => {
      if (!cancelled) setDone(true);
    });

    return () => {
      cancelled = true;
      gsap.killTweensOf(progress.current);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [render]);

  useEffect(() => {
    if (!done || !rootRef.current) return;
    const el = rootRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({
      onComplete: () => {
        if (rootRef.current) rootRef.current.style.display = "none";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.dataset.bootLoaderComplete = "true";
        window.dispatchEvent(new Event("bootloader:complete"));
      },
    });
    tl.to(progress.current, {
      value: 100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
      onUpdate: render,
    }).to(el, {
      clipPath: "inset(0 0 100% 0)",
      duration: reduced ? 0.25 : 1.15,
      ease: "expo.inOut",
    });
    return () => tl.kill();
  }, [done, render]);

  return (
    <>
      {children}
      <div
        ref={rootRef}
        className="fixed inset-0 z-[200] flex flex-col justify-center overflow-hidden bg-[#2A2725]  text-[#EDE6D6]"
        aria-hidden={done}
      >
        <div className="w-full">
          <div className="flex items-end justify-between px-2">
            <span className="font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]">
              <Logo className="h-14 w-auto md:h-[4.5rem]" />
            </span>
            <span className="shrink-0 font-sans text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
              {String(percent).padStart(2, "0")}
            </span>
          </div>
          <div
            className="mt-7 h-[3px] w-full overflow-hidden bg-[#EDE6D6]/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div
              ref={barRef}
              className="h-full origin-left bg-[#EDE6D6] will-change-transform"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default function BootLoader({ children }) {
  const pathname = usePathname();
  const skip = useRef(pathname?.startsWith("/tour") ?? false);

  useEffect(() => {
    if (skip.current) {
      document.body.dataset.bootLoaderComplete = "true";
      window.dispatchEvent(new Event("bootloader:complete"));
    }
  }, [pathname]);

  return skip.current ? <>{children}</> : <Loader>{children}</Loader>;
}
