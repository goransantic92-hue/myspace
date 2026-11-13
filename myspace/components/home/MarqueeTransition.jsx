"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import InkDissolveOverlay from "./villa/InkDissolveOverlay";
import { BRAND } from "@/lib/brand";

const VillaExplorer = dynamic(() => import("./villa/VillaExplorer"), { ssr: false });

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = Array.from({ length: 8 }, () => BRAND);
const GROUPS = ["full", 0, 1, 2, 3, 4, 5];
const TOTAL_VH = 220 + 100 * GROUPS.length;
const EXPAND_END = 100 / TOTAL_VH;
const EXPLORE_START = 220 / TOTAL_VH;

export default function MarqueeTransition() {
  const ref = useRef(null);
  const inkProgress = useRef(0);
  const exploreProgress = useRef(0);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [group, setGroup] = useState("full");

  useGSAP(
    () => {
      const section = ref.current;
      const stage = section?.querySelector(".marquee-stage");
      const canvas = section?.querySelector(".marquee-canvas");
      const track = section?.querySelector(".marquee-track");
      const prompt = section?.querySelector(".marquee-prompt");
      if (!section || !stage || !canvas || !track) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(orientation: landscape) and (max-height: 500px) and (max-width: 1023px)",
        () => {
          gsap.set(canvas, { width: "72vh", height: "45vh" });
        },
      );

      gsap.to(track, { xPercent: -33.333, duration: 20, ease: "none", repeat: -1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: stage,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const p = tl.progress();
          inkProgress.current =
            1.5 * gsap.utils.clamp(0, 1, (p - EXPAND_END) / (EXPLORE_START - EXPAND_END));
          exploreProgress.current = gsap.utils.clamp(
            0,
            1,
            (p - EXPLORE_START) / (1 - EXPLORE_START),
          );
          setVisible(p >= EXPAND_END);
          setActive(p >= EXPAND_END && p < 1);
          if (p < EXPLORE_START) setGroup("full");
          else {
            const idx = Math.min(
              GROUPS.length - 1,
              Math.floor(((p - EXPLORE_START) / (1 - EXPLORE_START)) * GROUPS.length),
            );
            setGroup(GROUPS[idx]);
          }
        },
      });

      tl.to({}, { duration: 1 }, 0);
      tl.to(
        canvas,
        { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut", duration: EXPAND_END },
        0,
      )
        .to(prompt, { opacity: 0, duration: 30 / TOTAL_VH }, 0)
        .to(track, { opacity: 0, yPercent: -25, duration: 60 / TOTAL_VH }, 20 / TOTAL_VH);

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="marquee-transition"
      ref={ref}
      className="relative bg-[#EDE6D6] text-[#2A2725]"
      style={{ height: `${TOTAL_VH + 100}vh` }}
    >
      <div className="marquee-stage relative h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap font-sans text-[clamp(2.5rem,10vw,8rem)] font-medium leading-none tracking-[-0.07em] lg:text-[clamp(3.5rem,7.5vw,8rem)]">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex shrink-0">
                {WORDS.map((word, i) => (
                  <span key={i} className="mx-[0.2em]">
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <InkDissolveOverlay image="/assets/images/hero5.webp" progressRef={inkProgress} />
        <div className="marquee-prompt absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-black/55">
          Scroll to enter
        </div>
        <VillaExplorer
          visible={visible}
          animationActive={active}
          activeGroupIndex={group}
          onGroupSelect={setGroup}
          progressRef={exploreProgress}
        />
      </div>
    </section>
  );
}
