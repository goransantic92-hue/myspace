"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { textReveal01 } from "@/components/layout/TextReveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WASH_MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 15%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.9) 42%, #000 50%)";

export default function ApartmentTransition() {
  const ref = useRef(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const clouds = section.querySelectorAll(".ap-transition-cloud");
      const wash = section.querySelector(".ap-transition-wash");
      const copy = section.querySelector(".ap-transition-copy");
      const revertReveal = textReveal01(section);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 10%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          clouds[1],
          { yPercent: 10, opacity: 0 },
          { yPercent: -30, opacity: 1, ease: "none", duration: 0.3 },
          0,
        )
        .fromTo(
          clouds[0],
          { yPercent: 20, opacity: 0 },
          { yPercent: -20, opacity: 1, ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(wash, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.5)
        .fromTo(
          copy,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.55 },
          0.85,
        )
        .to({}, { duration: 0.01 }, 1.55);

      return revertReveal;
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      className="ap-transition relative z-30 -mt-[50vh] h-[var(--h-m)] w-full overflow-x-clip bg-white text-[#2A2725] lg:h-[var(--h-d)]"
      style={{ "--h-d": "160vh", "--h-m": "80vh" }}
      aria-label="Transition from villa to apartment"
    >
      <div
        aria-hidden="true"
        className="ap-transition-wash pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-white opacity-0"
        style={{ WebkitMaskImage: WASH_MASK, maskImage: WASH_MASK }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[-42vh] md:top-[-52vh] z-30 h-[112vh] w-full"
      >
        <img
          src="/assets/images/cloud-1-cropped.webp"
          alt=""
          className="ap-transition-cloud absolute left-0 top-[25%] h-auto w-full max-w-none opacity-0 lg:top-0"
        />
        <img
          src="/assets/images/cloud-2-full.webp"
          alt=""
          className="ap-transition-cloud absolute left-0 top-[20%] h-auto w-full max-w-none opacity-0 lg:top-[8%]"
        />
      </div>
      <div className="sticky top-0 z-40 flex h-[100svh] w-full items-center justify-center px-6 lg:h-screen">
        <div className="ap-transition-copy flex flex-col items-center text-center opacity-0">
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] lg:mb-5 lg:text-xs">
            A private residence
          </p>
          <h2
            data-reveal-01
            data-reveal-local
            data-scroll
            data-duration="1"
            data-stagger="0.02"
            className="ap-transition-heading max-w-[15ch] font-serif text-[clamp(2.25rem,9vw,8rem)] leading-[94%]"
          >
            Not every space
            <br />
            needs to be grand.
          </h2>
        </div>
      </div>
    </section>
  );
}
