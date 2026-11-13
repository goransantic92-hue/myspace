"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SmoothScroll() {
  const scope = useRef(null);
  const lenisRef = useRef(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useGSAP(
    () => {
      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: !window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches,
      });
      lenisRef.current = lenis;
      window.__lenis = lenis;
      const tick = (time) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      };
    },
    { scope },
  );

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const toTop = () => {
      lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    toTop();
    ScrollTrigger.clearScrollMemory();
    const refresh = () => {
      toTop();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(refresh);
      });
    });
    const timeout = window.setTimeout(toTop, 100);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return <div ref={scope} className="contents" />;
}
