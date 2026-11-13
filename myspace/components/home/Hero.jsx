"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ContactModal from "@/components/layout/ContactModal";
import { BRAND, TAGLINE } from "@/lib/brand";

gsap.registerPlugin(useGSAP);

function intro() {
  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".hero-image", { scale: 1.08, duration: 2, ease: "power2.out" })
    .from(".hero-actions", { y: 20, opacity: 0, duration: 0.8 }, "-=0.2")
    .from(".hero-meta-inner", { y: 15, opacity: 0, duration: 0.7 }, "-=0.4")
    .from(".hero-bottom-inner", { y: 15, opacity: 0, duration: 0.7 }, "-=0.4");
}

function Meta({ children }) {
  return (
    <p
      data-reveal-01="chars"
      className="text-[11px] uppercase tracking-[0.18em] text-white md:text-sm lg:text-lg lm:text-[10px]"
    >
      {children}
    </p>
  );
}

function HeroLink({ href, children, className = "", onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg lm:text-xs ${className}`}
    >
      <span data-hover-reveal className="border-b border-white">
        {children}
      </span>
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);
  useGSAP(intro, { scope: ref });

  return (
    <section
      ref={ref}
      className="sticky top-0 z-0 h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black text-white lg:h-screen lg:min-h-screen select-none"
    >
      <div className="hero-image-wrap absolute inset-0 pointer-events-none">
        <img
          src="/assets/images/hero3.webp"
          alt="Contemporary private residence"
          className="hero-image h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35 " />
      </div>

      <div className="hero-content pointer-events-auto absolute inset-0 z-10">
        <div
          className="absolute left-6 top-[16%] md:left-10 lg:left-10 lg:top-[7%] lm:top-[18%]"
        >
          <h1
            data-reveal-01
            className="hero-title-line font-serif text-[clamp(2.75rem,12vw,4.5rem)] leading-[94%] text-white md:text-[5rem] lg:text-[5.64rem] lm:text-[2.25rem]"
          >
            {BRAND}
          </h1>
          <div
            className="hero-actions mt-4 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:gap-5 lm:mt-2 lm:flex-row lm:gap-5"
          >
            <HeroLink
              href="#contact"
              className="pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                setContactOpen(true);
              }}
            >
              Start a project
            </HeroLink>
          </div>
        </div>

        <div
          className="hero-meta pointer-events-none absolute bottom-[13%] left-0 right-0 lg:inset-0 lg:flex lg:items-center lm:bottom-14"
        >
          <div className="hero-meta-inner relative w-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-4 inset-x-0 bg-black/25 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent,#000_28%,#000_72%,transparent)]"
            />
            <div className="relative z-10 grid w-full grid-cols-2 gap-x-6 gap-y-1 px-6 md:flex md:items-end md:justify-between md:gap-0 md:px-10 lg:flex lg:items-end lg:justify-between lg:px-10 lm:flex lm:items-end lm:justify-between lm:gap-0">
              {["Architecture", "Planning", "Engineering", "Dubai"].map(
                (label) => (
                  <Meta key={label}>{label}</Meta>
                ),
              )}
            </div>
          </div>
        </div>

        <div
          className="hero-bottom absolute bottom-6 w-full px-6 text-center md:bottom-7 lm:bottom-3"
        >
          <div className="hero-bottom-inner">
            <p
              data-reveal-01="chars"
              className="text-sm text-white leading-[120%] md:text-base lg:text-lg lm:text-xs"
            >
              {TAGLINE}
            </p>
          </div>
        </div>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
