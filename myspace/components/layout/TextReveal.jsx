"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export function textReveal01(root = document) {
  const splits = [];
  const selector =
    root === document
      ? "[data-reveal-01]:not([data-reveal-local])"
      : "[data-reveal-01]";
  const els = [...root.querySelectorAll(selector)];
  gsap.set(els, { visibility: "visible" });
  els.forEach((el) => {
    const onScroll = el.hasAttribute("data-scroll");
    const trigger = el.closest("section") || el;
    const split = SplitText.create(el, {
      type: "chars, words, lines",
      mask: "chars",
      autoSplit: true,
      linesClass: "line",
      wordsClass: "word",
      charsClass: "char",
      onSplit(self) {
        const duration = parseFloat(el.dataset.duration);
        const stagger = parseFloat(el.dataset.stagger);
        const vars = {
          yPercent: 110,
          duration: Number.isNaN(duration) ? 1 : duration,
          stagger: Number.isNaN(stagger) ? 0.02 : stagger,
          immediateRender: true,
          ease: el.dataset.ease || "expo.out",
        };
        if (onScroll) {
          vars.scrollTrigger = {
            trigger,
            start: "clamp(top 50%)",
            once: true,
          };
        }
        return gsap.from(self.chars, vars);
      },
    });
    splits.push(split);
  });
  return () => splits.forEach((s) => s.revert());
}

function hoverReveal(root = document) {
  const cleanups = [];
  root.querySelectorAll("[data-hover-reveal]").forEach((el) => {
    if (el.dataset.hoverRevealInitialized === "true") return;
    const text = el.textContent.trim();
    if (!text) return;
    el.dataset.hoverRevealInitialized = "true";

    const track = document.createElement("span");
    track.className = "hover-reveal-track";
    track.setAttribute("aria-hidden", "true");
    const lineA = document.createElement("span");
    const lineB = document.createElement("span");
    lineA.className = "hover-reveal-line";
    lineB.className = "hover-reveal-line";
    lineA.textContent = text;
    lineB.textContent = text;
    track.append(lineA, lineB);
    el.textContent = "";
    el.appendChild(track);

    const a = SplitText.create(lineA, {
      type: "chars",
      charsClass: "hover-reveal-char",
      aria: "none",
    });
    const b = SplitText.create(lineB, {
      type: "chars",
      charsClass: "hover-reveal-char",
      aria: "none",
    });
    gsap.set(a.chars, { yPercent: 0 });
    gsap.set(b.chars, { yPercent: 110 });

    const enter = () => {
      gsap.to(a.chars, {
        yPercent: -110,
        duration: 0.4,
        stagger: 0.02,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(b.chars, {
        yPercent: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const leave = () => {
      gsap.to(a.chars, {
        yPercent: 0,
        duration: 0.35,
        stagger: 0.015,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(b.chars, {
        yPercent: 110,
        duration: 0.35,
        stagger: 0.015,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    cleanups.push(() => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      a.revert();
      b.revert();
      el.textContent = text;
      delete el.dataset.hoverRevealInitialized;
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

function setup() {
  let cleanup;
  let disposed = false;
  const run = () => {
    if (disposed) return;
    const revertReveal = textReveal01(document);
    const revertHover = hoverReveal(document);
    cleanup = () => {
      revertReveal();
      revertHover();
    };
    ScrollTrigger.refresh();
  };
  const start = () => {
    document.fonts?.ready ? document.fonts.ready.then(run) : run();
  };
  if (document.body.dataset.bootLoaderComplete === "true") start();
  else window.addEventListener("bootloader:complete", start, { once: true });
  return () => {
    disposed = true;
    window.removeEventListener("bootloader:complete", start);
    cleanup?.();
  };
}

export default function TextReveal() {
  const scope = useRef(null);
  const pathname = usePathname();
  useGSAP(setup, { scope, dependencies: [pathname], revertOnUpdate: true });
  return <div ref={scope} className="hidden" aria-hidden="true" />;
}
