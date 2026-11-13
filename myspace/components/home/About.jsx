"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BRAND } from "@/lib/brand";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 15%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.9) 42%, #000 50%)";

const IMAGES = [
  "/assets/images/patio-front-clean.webp",
  "/assets/images/living-room-clean.webp",
  "/assets/images/kitchen-clean.webp",
  "/assets/images/exterior-garden-clean.webp",
  "/assets/images/top.webp",
  "/assets/images/nightSide.webp",
  "/assets/images/landscape-house-clean.webp",
];

const WORDS =
  "We create residences where architecture, light, and material come together to shape a quieter way of living.".split(
    " ",
  );

const TILES = [
  { pos: "left-[-1%] top-[14%] h-[43%] w-[26%]", side: "l", rotate: -4 },
  { pos: "left-[2%] top-[61%] h-[22%] w-[20%]", side: "l", rotate: 3 },
  { pos: "left-[25%] top-[70%] h-[26%] w-[22%]", side: "l", rotate: -2 },
  { pos: "left-[51%] top-[1%] h-[21%] w-[16%]", side: "r", rotate: -6 },
  { pos: "left-[73%] top-[15%] h-[29%] w-[27%]", side: "r", rotate: 8 },
  { pos: "left-[74%] top-[54%] h-[39%] w-[25%]", side: "r", rotate: -4 },
];

const TILE_CLASS = {
  l: "about-tile about-tile-l",
  r: "about-tile about-tile-r",
};

function Arrow({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir < 0 ? "M13 8H3M7.5 3.5 3 8l4.5 4.5" : "M3 8h10M8.5 3.5 13 8l-4.5 4.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const arrowBtn =
  "flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE6D6] text-[#2A2725] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A2725] lm:h-8 lm:w-8";

export default function About() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const boxRef = useRef(null);
  const indexRef = useRef(0);
  const animating = useRef(false);
  const timer = useRef(null);
  const visible = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const box = boxRef.current;
      if (!section || !stage || !box) return;
      const clouds = section.querySelectorAll(".about-cloud");
      const bg = section.querySelector(".about-bg");
      const tiles = section.querySelectorAll(".about-tile");
      const tilesL = section.querySelectorAll(".about-tile-l");
      const tilesR = section.querySelectorAll(".about-tile-r");
      const gallery = section.querySelector(".about-gallery");
      const arrows = section.querySelector(".about-arrows");
      const textLayer = section.querySelector(".about-text-layer");
      const words = section.querySelectorAll(".about-word");
      const rule = section.querySelector(".about-rule");
      const copy = section.querySelector(".about-supporting-copy");
      const slides = box.querySelectorAll(".about-slide");
      const slotCenter = section.querySelector(".about-slot-center");
      const slotInline = section.querySelector(".about-slot-inline");
      const heroWrap = document.querySelector(".hero-image-wrap");
      const heroContent = document.querySelector(".hero-content");

      gsap.set(slides, { xPercent: 100 });
      gsap.set(slides[0], { xPercent: 0 });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 0,
          end: () =>
            section.getBoundingClientRect().top +
            window.scrollY -
            0.1 * window.innerHeight,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      if (heroWrap) intro.to(heroWrap, { scale: 1.12, ease: "none" }, 0);
      if (heroContent)
        intro.to(
          heroContent,
          { y: -80, opacity: 0, ease: "power2.in", duration: 0.25 },
          0,
        );
      intro
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
        .fromTo(bg, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.5)
        .fromTo(
          tiles,
          { opacity: 0, y: 56, scale: 0.86 },
          { opacity: 1, y: 0, scale: 1, ease: "expo.out", duration: 0.55, stagger: 0.07 },
          0.85,
        )
        .fromTo(box, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.85)
        .to({}, { duration: 0.01 }, 1.55);

      const rectOf = (el) => {
        const s = stage.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
      };
      const full = () => ({
        left: () => 0.03 * stage.clientWidth,
        top: () => 0.03 * stage.clientHeight,
        width: () => 0.94 * stage.clientWidth,
        height: () => 0.94 * stage.clientHeight,
        borderRadius: 24,
      });
      const fromCenter = {
        left: () => rectOf(slotCenter).x,
        top: () => rectOf(slotCenter).y,
        width: () => rectOf(slotCenter).w,
        height: () => rectOf(slotCenter).h,
        borderRadius: 12,
      };
      const toInline = {
        left: () => rectOf(slotInline).x,
        top: () => rectOf(slotInline).y,
        width: () => rectOf(slotInline).w,
        height: () => rectOf(slotInline).h,
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(box, fromCenter, { ...full(), ease: "power2.inOut", duration: 1 }, 0)
          .to(tilesL, { x: "-48vw", scale: 0.9, ease: "power2.in", duration: 0.2, stagger: 0.03 }, 0)
          .to(tilesR, { x: "48vw", scale: 0.9, ease: "power2.in", duration: 0.2, stagger: 0.03 }, 0)
          .to(gallery, { autoAlpha: 0, duration: 0.25 }, 0)
          .to(arrows, { autoAlpha: 0, duration: 0.2 }, 1.5)
          .fromTo(
            box,
            { ...full() },
            { ...toInline, borderRadius: 8, ease: "power3.inOut", duration: 1.2, immediateRender: false },
            1.5,
          )
          .fromTo(textLayer, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 1.7)
          .fromTo(
            words,
            { yPercent: 110 },
            { yPercent: 0, ease: "power3.out", duration: 0.5, stagger: 0.03 },
            1.9,
          )
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.5 }, 2.4)
          .fromTo(copy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.4 }, 2.8);
      });
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(gallery, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(arrows, { autoAlpha: 0, duration: 0.2 }, 0)
          .fromTo(
            box,
            fromCenter,
            { ...toInline, borderRadius: 4, ease: "power3.inOut", duration: 1.1 },
            0,
          )
          .fromTo(textLayer, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 0.5)
          .fromTo(
            words,
            { yPercent: 110 },
            { yPercent: 0, ease: "power3.out", duration: 0.5, stagger: 0.025 },
            0.7,
          )
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.4 }, 1.3)
          .fromTo(copy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.4 }, 1.55);
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const go = contextSafe((dir) => {
    if (animating.current) return;
    const slides = boxRef.current.querySelectorAll(".about-slide");
    const count = slides.length;
    const current = indexRef.current;
    const next = (current + dir + count) % count;
    animating.current = true;
    gsap.set(slides[next], { xPercent: 100 * dir, zIndex: 2 });
    gsap.set(slides[current], { zIndex: 1 });
    gsap.to(slides[current], { xPercent: -30 * dir, duration: 1, ease: "expo.out" });
    gsap.to(slides[next], {
      xPercent: 0,
      duration: 1,
      ease: "expo.out",
      onComplete: () => {
        animating.current = false;
      },
    });
    indexRef.current = next;
  });
  const goRef = useRef(go);
  goRef.current = go;

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  const start = () => {
    stop();
    if (
      visible.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      timer.current = setInterval(() => goRef.current(1), 2000);
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        entry.isIntersecting ? start() : stop();
      },
      { threshold: 0.2 },
    );
    io.observe(stage);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = (dir) => {
    go(dir);
    start();
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 overflow-x-clip text-[#2A2725] bg-[#EDE6D6]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[-42vh] md:top-[-52vh] z-30 h-[112vh] w-full"
      >
        <img
          src="/assets/images/cloud-1-cropped-beige.webp"
          alt=""
          className="about-cloud absolute top-[25%] lg:top-0 left-[-0%] h-auto w-[100%] max-w-none opacity-0"
        />
        <img
          src="/assets/images/cloud-2-full-beige.webp"
          alt=""
          className="about-cloud absolute top-[20%] lg:top-[8%] left-[-0%] h-auto w-[100%] max-w-none opacity-0"
        />
      </div>
      <div
        aria-hidden="true"
        className="about-bg pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-[#EDE6D6] opacity-0"
        style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      />

      <div
        ref={stageRef}
        className="about-stage relative z-40 h-[100svh] w-full overflow-hidden lg:h-screen"
      >
        <div
          aria-hidden="true"
          className="about-slot-center pointer-events-none invisible absolute left-[6%] top-[24%] h-[40%] w-[88%] md:left-[10%] md:top-[26%] md:h-[38%] md:w-[80%] lg:left-[26%] lg:top-[24%] lg:h-[38%] lg:w-[46%] lm:left-[15%] lm:top-[25%] lm:h-[60%] lm:w-[70%]"
        />

        <div className="about-gallery absolute inset-0">
          <p
            data-reveal-01="chars"
            data-scroll
            className="about-tile absolute inset-x-0 top-[12%] px-6 text-center font-serif text-3xl leading-tight opacity-0 lg:inset-x-auto lg:left-[26%] lg:top-[0%] lg:w-[20%] lg:px-0 lg:text-[3.5vw] lm:top-[13%] lm:text-2xl"
          >
            A quieter way to live
          </p>
          {TILES.map((tile, i) => (
            <div
              key={i}
              className={`${TILE_CLASS[tile.side]} absolute hidden overflow-hidden rounded-xl opacity-0 lg:block ${tile.pos}`}
              style={{ rotate: `${tile.rotate}deg` }}
            >
              <img
                src={IMAGES[i % IMAGES.length]}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="about-text-layer absolute inset-0 flex items-center px-6 opacity-0 lg:px-10">
          <div className="grid w-full grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 lg:col-span-2 lm:col-span-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#2A2725]">
                About
              </div>
            </div>
            <div className="col-span-12 lg:col-span-10 lm:col-span-10">
              <p className="font-sans text-[clamp(1.75rem,7vw,2.5rem)] leading-[1.05] tracking-[-0.045em] lg:text-[5.2vw] lg:leading-[80%] lm:text-[1.75rem]">
                <span
                  aria-hidden="true"
                  className="about-slot-inline mb-[0.14em] mr-[0.18em] inline-block h-[0.82em] w-[1.7em] align-bottom"
                />
                {WORDS.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="-mb-[0.1em] -mt-[1em] mr-[0.25em] inline-block overflow-hidden pb-[0.2em] pt-[0.1em] align-bottom"
                  >
                    <span className="about-word inline-block">{word}</span>
                  </span>
                ))}
              </p>
              <div className="about-rule mt-4 h-px w-full bg-[#2A2725] lg:mt-6 lm:mt-3" />
              <p className="about-supporting-copy mt-4 max-w-[350px] text-sm leading-[1.35] tracking-[-0.01em] opacity-0 lg:mt-6 lg:text-lg lm:mt-2 lm:max-w-[420px] lm:text-xs">
                {BRAND} is a contemporary residential experience shaped around
                considered spaces, natural light, honest materials, and the
                feeling of living within them.
              </p>
            </div>
          </div>
        </div>

        <div
          ref={boxRef}
          className="about-box absolute left-0 top-0 z-50 overflow-hidden rounded-xl opacity-0"
        >
          {IMAGES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${BRAND} interior ${i + 1}`}
              className="about-slide absolute inset-0 h-full w-full object-cover"
            />
          ))}
          <div className="about-arrows absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-3 lm:bottom-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className={arrowBtn}
            >
              <Arrow dir={-1} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className={arrowBtn}
            >
              <Arrow dir={1} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
