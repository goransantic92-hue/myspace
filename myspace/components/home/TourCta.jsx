"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HandClickIcon } from "@/components/layout/icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CONTROLS = [
  { keys: ["W", "A", "S", "D"], label: "Move" },
  { keys: ["E"], label: "Interact" },
  { keys: ["Q"], label: "Customize" },
];

function IdlePrefetch({ path = "/tour" }) {
  const router = useRouter();
  useEffect(() => {
    const conn = navigator.connection;
    if (conn?.saveData || ["slow-2g", "2g"].includes(conn?.effectiveType)) return;
    let idleId;
    let timeoutId;
    let cancelled = false;
    const prefetch = () => {
      if (!cancelled) router.prefetch(path);
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(prefetch, { timeout: 4000 });
      } else {
        timeoutId = setTimeout(prefetch, 2000);
      }
    };
    if (document.body.dataset.bootLoaderComplete === "true") schedule();
    else window.addEventListener("bootloader:complete", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("bootloader:complete", schedule);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      clearTimeout(timeoutId);
    };
  }, [router, path]);
  return null;
}

function Mask({ children }) {
  return (
    <span className="-mb-[0.18em] -mt-[0.05em] block overflow-hidden pb-[0.18em] pt-[0.05em]">
      {children}
    </span>
  );
}

function Kbd({ children }) {
  return (
    <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-white/70 px-1.5 font-sans text-[11px] font-medium tracking-normal">
      {children}
    </kbd>
  );
}

function requestMobileFullscreen() {
  if (window.matchMedia("(min-width: 1024px)").matches) return;
  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!request || document.fullscreenElement || document.webkitFullscreenElement) return;
  try {
    request.call(el, { navigationUI: "hide" })?.catch?.(() => {});
  } catch {}
}

export default function TourCta({ href = "/tour" }) {
  const ref = useRef(null);
  const navigating = useRef(false);
  const router = useRouter();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector(".tour-stage");
      const box = root.querySelector(".tour-box");
      const inner = root.querySelector(".tour-inner");
      const pieces = gsap.utils.toArray(".tour-piece", root);
      const fade = root.querySelector(".tour-fade");
      const hint = root.querySelector(".tour-hint");
      const ring = root.querySelector(".tour-hint-ring");
      const icon = root.querySelector(".tour-hint-icon");

      gsap.set(pieces, { yPercent: 110 });
      gsap.set(fade, { opacity: 0, y: 16 });
      gsap.set(hint, { opacity: 0, scale: 0.6 });

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (context) => {
        const rect = context.conditions.desktop
          ? { left: 19, top: 14, width: 62, height: 72 }
          : { left: 4, top: 12, width: 92, height: 70 };
        gsap.set(box, {
          left: `${rect.left}%`,
          top: `${rect.top}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
          borderRadius: 28,
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: stage, start: "top top", pin: true, anticipatePin: 1 },
        });
        tl.to(
          box,
          { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0, ease: "power2.inOut", duration: 1 },
          0,
        )
          .fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
          .to(pieces, { yPercent: 0, ease: "power3.out", duration: 0.9, stagger: 0.08 }, 1)
          .to(fade, { opacity: 1, y: 0, ease: "power3.out", duration: 0.7 }, 1.45)
          .to(hint, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.15)
          .to(icon, { y: -5, duration: 0.35, repeat: 5, yoyo: true, ease: "power1.inOut" }, 2.15)
          .fromTo(
            ring,
            { scale: 1, opacity: 0.6 },
            { scale: 2, opacity: 0, duration: 0.7, repeat: 2, ease: "power1.out" },
            2.15,
          )
          .to(hint, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" }, 4.25)
          .to({}, { duration: 0.35 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const enter = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (navigating.current) return;
      navigating.current = true;
      requestMobileFullscreen();
      router.push(href);
    },
    [href, router],
  );

  return (
    <section id="residence-02-tour" ref={ref} className="relative z-30 w-full bg-[#EDE6D6] text-white">
      <IdlePrefetch path={href} />
      <div className="tour-stage relative h-screen w-full overflow-hidden bg-[#EDE6D6]">
        <div
          className="tour-box absolute left-[4%] top-[12%] h-[70%] w-[92%] overflow-hidden rounded-[28px] lg:left-[19%] lg:top-[14%] lg:h-[72%] lg:w-[62%]"
          onClick={enter}
        >
          <img
            src="/assets/images/apartment-tour.webp"
            alt="A private residence at golden hour, the living room glowing behind tall glass doors"
            className="tour-inner h-full w-full object-cover will-change-transform"
          />
          <div className="absolute top-8 inset-0 flex flex-col justify-between p-6 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <Mask>
                <p className="tour-piece text-xs uppercase tracking-[0.2em]">Private residence · 3D walkthrough</p>
              </Mask>
              <div className="hidden lg:block">
                <Mask>
                  <ul
                    className="tour-piece flex items-center gap-6 text-[10px] uppercase tracking-[0.18em]"
                    aria-label="Walkthrough controls"
                  >
                    {CONTROLS.map((c) => (
                      <li key={c.label} className="flex items-center gap-2.5">
                        <span className="flex items-center gap-1">
                          {c.keys.map((k) => (
                            <Kbd key={k}>{k}</Kbd>
                          ))}
                        </span>
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </Mask>
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <h2 className="font-sans text-[clamp(2.75rem,12vw,5.5rem)] leading-[0.9] tracking-[-0.05em] lg:text-[7.5vw]">
                <Mask>
                  <span className="tour-piece block">Step inside.</span>
                </Mask>
              </h2>
              <div className="flex max-w-md flex-col items-start gap-5">
                <Mask>
                  <p
                    data-reveal-01
                    className="tour-piece text-xs leading-[1.5] tracking-[-0.01em] md:text-sm"
                  >
                    This is how a client could walk through a house before it is built. Explore the
                    rooms, open the doors, and find your own way through the space.
                  </p>
                </Mask>
                <div className="relative">
                  <a
                    data-hover-reveal
                    href={href}
                    onClick={enter}
                    className="tour-fade inline-block rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-[#2A2725] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    Enter the residence →
                  </a>
                  <span
                    aria-hidden="true"
                    className="tour-hint pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center"
                  >
                    <span className="tour-hint-ring absolute inset-0 rounded-full bg-white/60" />
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2725] shadow-lg">
                      <HandClickIcon className="tour-hint-icon text-xl" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
