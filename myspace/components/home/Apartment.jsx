"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_LINES = ["A home,", "room by room."];
const SEP = " · ";

const ROOMS = [
  {
    image: {
      src: "/assets/images/apartment-living.webp",
      alt: "Sunlit living area with a linen sofa and oak floor",
      position: "50% 50%",
    },
    eyebrow: "The living area",
    lines: ["Everything", "within reach."],
    copy: "A considered space for everyday living. Thoughtfully arranged rooms, warm materials, and room for the way a household actually lives.",
    details: ["Two bedrooms", "Living area", "Kitchen", "Bathroom"].join(SEP),
  },
  {
    image: {
      src: "/assets/images/apartment-bedroom.webp",
      alt: "Bedroom with a deep red headboard and a window onto the trees",
      position: "50% 50%",
    },
    eyebrow: "The bedroom",
    lines: ["Slow mornings,", "softly lit."],
    copy: "Warm linen, deep tones, and a window onto the trees. A room that asks nothing of you but rest.",
    details: ["Garden view", "Natural textiles"].join(SEP),
  },
  {
    image: {
      src: "/assets/images/apartment-bedroom-2.webp",
      alt: "Second bedroom with sheer curtains and an olive tree",
      position: "45% 50%",
    },
    eyebrow: "The second room",
    lines: ["Room for", "one more."],
    copy: "A second bedroom kept just as considered, with filtered light, woven textures and a quiet corner of green.",
    details: ["Filtered light", "Woven textures"].join(SEP),
  },
];

const COUNT = ROOMS.length;
const pad = (n) => String(n).padStart(2, "0");
const mainIndexFor = (step) => (step === 0 ? 0 : step - 1);
const thumb = { borderRadius: 18 };

const LAYOUTS = {
  desktop: {
    hero: { left: 0, top: 0, width: 100, height: 100, borderRadius: 0, opacity: 1 },
    main: { left: 27, top: 3.4, width: 45, height: 93.2, borderRadius: 28, opacity: 1 },
    prev: { left: 16.6, top: 3.4, width: 8.6, height: 18, ...thumb, opacity: 1 },
    next: { left: 74, top: 78.6, width: 8.6, height: 18, ...thumb, opacity: 1 },
    out: { left: 16.6, top: 3.4, width: 8.6, height: 18, ...thumb, opacity: 0 },
    wait: { left: 74, top: 78.6, width: 8.6, height: 18, ...thumb, opacity: 0 },
  },
  mobile: {
    hero: { left: 0, top: 0, width: 100, height: 100, borderRadius: 0, opacity: 1 },
    main: { left: 4, top: 9, width: 92, height: 44, borderRadius: 28, opacity: 1 },
    prev: { left: 6, top: 42, width: 20, height: 9, ...thumb, opacity: 1 },
    next: { left: 74, top: 42, width: 20, height: 9, ...thumb, opacity: 1 },
    out: { left: 6, top: 42, width: 20, height: 9, ...thumb, opacity: 0 },
    wait: { left: 74, top: 42, width: 20, height: 9, ...thumb, opacity: 0 },
  },
};

const toCss = (l) => ({
  left: `${l.left}%`,
  top: `${l.top}%`,
  width: `${l.width}%`,
  height: `${l.height}%`,
  borderRadius: l.borderRadius,
  opacity: l.opacity,
});

const PIN_LENGTH = 130 + 110 * COUNT + 40;

function Mask({ children }) {
  return (
    <span className="-mb-[0.18em] -mt-[0.05em] block overflow-hidden pb-[0.18em] pt-[0.05em]">
      {children}
    </span>
  );
}

export default function Apartment() {
  const ref = useRef(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector(".ap-stage");
      const imgs = gsap.utils.toArray(".ap-img", root);
      const inners = gsap.utils.toArray(".ap-img-inner", root);
      const heroPieces = gsap.utils.toArray(".ap-hero-piece", root);
      const heroScrim = root.querySelector(".ap-hero-scrim");
      const texts = gsap.utils
        .toArray(".ap-text", root)
        .map((el) => gsap.utils.toArray(".ap-piece", el));
      const label = root.querySelector(".ap-label");
      const countCol = root.querySelector(".ap-count-col");
      let current = -1;
      const labelFor = (s) => (s < 0 ? "hidden" : `s${s}`);

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop:
            "(min-width: 1024px), (orientation: landscape) and (max-height: 500px) and (max-width: 1023px)",
          mobile: "(max-width: 1023px)",
        },
        (context) => {
          let tween;
          const desktop = context.conditions.desktop;
          const L = desktop ? LAYOUTS.desktop : LAYOUTS.mobile;
          const slot = (i, step) => {
            if (step === 0) return i === 0 ? L.hero : L.wait;
            const rel = i - (step - 1);
            if (rel <= -2) return L.out;
            if (rel === -1) return L.prev;
            if (rel === 0) return L.main;
            if (rel === 1) return L.next;
            return L.wait;
          };

          imgs.forEach((el, i) => gsap.set(el, { ...toCss(slot(i, 0)), zIndex: COUNT - i }));
          gsap.set(inners, { scale: (i) => (i === 0 ? 1 : 1.2) });
          gsap.set(heroPieces, { yPercent: 110, opacity: 0 });
          gsap.set(heroScrim, { opacity: 0 });
          texts.forEach((pieces) => gsap.set(pieces, { yPercent: 110, opacity: 0 }));
          gsap.set(label, { opacity: 0 });

          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: "+=100%",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              imgs[0],
              {
                clipPath: desktop
                  ? "inset(24% 32% 24% 32% round 28px)"
                  : "inset(30% 8% 30% 8% round 28px)",
              },
              { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 },
              0,
            )
            .fromTo(inners[0], { scale: 1.3 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
            .fromTo(
              stage,
              { backgroundColor: "#FFFFFF" },
              { backgroundColor: "#EDE6D6", duration: 0.4 },
              0.6,
            );

          const tl = gsap.timeline({ paused: true });
          tl.addLabel("hidden", 0);
          tl.fromTo(
            heroPieces,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.09,
              ease: "power3.out",
              immediateRender: false,
            },
            0,
          );
          tl.fromTo(
            heroScrim,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power3.out", immediateRender: false },
            0,
          );
          tl.addLabel("s0", 1);

          for (let step = 1; step <= COUNT; step++) {
            const at = 1 + (step - 1) * 1.2;
            const first = step === 1;

            imgs.forEach((el, i) => {
              const from = slot(i, step - 1);
              const to = slot(i, step);
              if (from !== to) {
                const delayed = from === L.wait && to === L.next;
                tl.to(
                  el,
                  { ...toCss(to), duration: first && i === 0 ? 1.1 : 0.9, ease: "power3.inOut" },
                  delayed && first ? at + 0.6 : at,
                );
              }
              const fromScale = i === mainIndexFor(step - 1) ? 1 : 1.2;
              const toScale = i === mainIndexFor(step) ? 1 : 1.2;
              if (fromScale !== toScale) {
                tl.to(inners[i], { scale: toScale, duration: 0.9, ease: "power3.inOut" }, at);
              }
            });

            if (mainIndexFor(step) !== mainIndexFor(step - 1)) {
              tl.set(imgs[mainIndexFor(step)], { zIndex: 3 }, at);
              tl.set(imgs[mainIndexFor(step - 1)], { zIndex: 2 }, at);
            }

            if (first) {
              tl.to(heroScrim, { opacity: 0, duration: 0.35, ease: "power2.in" }, at);
              tl.fromTo(
                heroPieces,
                { yPercent: 0, opacity: 1 },
                {
                  yPercent: -110,
                  opacity: 0,
                  duration: 0.4,
                  stagger: 0.05,
                  ease: "power2.in",
                  immediateRender: false,
                },
                at,
              );
            } else {
              tl.fromTo(
                texts[step - 2],
                { yPercent: 0, opacity: 1 },
                {
                  yPercent: -110,
                  opacity: 0,
                  duration: 0.2,
                  stagger: 0.03,
                  ease: "power2.in",
                  immediateRender: false,
                },
                at,
              );
            }

            tl.to(
              texts[step - 1],
              { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" },
              at + (first ? 0.55 : 0.35),
            );

            if (first) tl.to(label, { opacity: 1, duration: 0.6 }, at + 0.6);
            else
              tl.to(
                countCol,
                { yPercent: -(100 / COUNT) * (step - 1), duration: 0.6, ease: "power3.inOut" },
                at,
              );

            tl.set({}, {}, at + 1.2);
            tl.addLabel(`s${step}`, at + 1.2);
          }

          tl.seek(labelFor(current));

          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: `+=${PIN_LENGTH}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const pos = self.progress * PIN_LENGTH;
              const rel = (pos - 100 - 30) / 110;
              const step =
                rel >= 0.6 ? Math.min(COUNT, Math.floor(rel - 0.6) + 1) : pos >= 90 ? 0 : -1;
              if (step !== current) {
                current = step;
                tween?.kill();
                tween = tl.tweenTo(labelFor(step), { ease: "none" });
              }
            },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <section ref={ref} id="residence-02" className="relative z-30 w-full bg-[#EDE6D6] text-[#2A2725]">
      <div className="ap-stage relative h-screen w-full overflow-hidden bg-white text-[#2A2725]">
        <div className="absolute inset-0">
          {ROOMS.map((room) => (
            <div key={room.image.src} className="ap-img absolute overflow-hidden">
              <img
                src={room.image.src}
                alt={room.image.alt}
                className="ap-img-inner h-full w-full object-cover will-change-transform"
                style={{ objectPosition: room.image.position }}
              />
            </div>
          ))}

          <div
            aria-hidden="true"
            className="ap-hero-scrim pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48%] bg-gradient-to-t from-black/60 via-black/30 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 px-6 pb-14 pt-6 text-white md:p-8 lg:gap-5 lg:p-12 lm:gap-2 lm:px-6 lm:pb-12 lm:pt-4">
            <Mask>
              <p className="ap-hero-piece text-[10px] uppercase tracking-[0.2em]">A private residence</p>
            </Mask>
            <h2 className="font-sans text-[clamp(2.75rem,12vw,5.5rem)] leading-[0.92] tracking-[-0.05em] lg:text-[7vw] lm:text-[7vw]">
              {HERO_LINES.map((line) => (
                <Mask key={line}>
                  <span className="ap-hero-piece block">{line}</span>
                </Mask>
              ))}
            </h2>
          </div>

          <div className="absolute bottom-[10%] left-5 right-5 top-[56%] z-20 lg:bottom-[24%] lg:left-[74%] lg:right-[3%] lg:top-[18%] lm:bottom-[14%] lm:left-[73%] lm:right-[3%] lm:top-[12%]">
            {ROOMS.map((room) => (
              <div
                key={room.eyebrow}
                className="ap-text absolute inset-0 flex flex-col justify-start gap-2.5 lg:justify-center lg:gap-6 lm:justify-center lm:gap-3"
              >
                <Mask>
                  <p className="ap-piece text-xs uppercase tracking-[0.16em] lg:text-sm">{room.eyebrow}</p>
                </Mask>
                <h2 className="font-sans text-[1.65rem] leading-[1] tracking-[-0.04em] md:text-[clamp(2rem,5vw,3rem)] lg:text-[3.6vw] lg:leading-[0.96] lm:text-[3.2vw]">
                  {room.lines.map((line) => (
                    <Mask key={line}>
                      <span className="ap-piece block">{line}</span>
                    </Mask>
                  ))}
                </h2>
                <Mask>
                  <p className="ap-piece max-w-[26rem] text-sm leading-snug tracking-[-0.01em] lg:text-lg lg:leading-[1.45] lm:text-sm lm:leading-[1.4]">
                    {room.copy}
                  </p>
                </Mask>
                <Mask>
                  <p className="ap-piece text-xs uppercase leading-[1.5] tracking-[0.14em] opacity-70 lg:text-sm lm:text-[11px]">
                    {room.details}
                  </p>
                </Mask>
              </div>
            ))}
          </div>

          <div className="ap-label absolute bottom-[3.4%] left-[2.6%] z-20 hidden items-center gap-4 text-[11px] uppercase tracking-[0.18em] lg:flex lm:flex">
            <span>Inside the residence</span>
            <span className="flex items-center gap-1 tabular-nums">
              <span className="block h-[1.4em] overflow-hidden leading-[1.4em]">
                <span className="ap-count-col flex flex-col">
                  {ROOMS.map((room, i) => (
                    <span key={room.eyebrow} className="block h-[1.4em] leading-[1.4em]">
                      {pad(i + 1)}
                    </span>
                  ))}
                </span>
              </span>
              <span className="opacity-50">/ {pad(COUNT)}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
