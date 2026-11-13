"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SLIDES = [
  {
    bg: "#2A2725",
    fg: "#FFFFFF",
    imageSide: "right",
    lines: ["Light,", "before", "anything else."],
    copy: "Dubai private residences. Orientation, openings and shade, considered from the first sketch, so a house stays bright without holding the heat.",
    image: { src: "/assets/images/side.webp", alt: "Residence facade in daylight" },
  },
  {
    bg: "#ffffff",
    fg: "#2A2725",
    imageSide: "left",
    lines: ["Material,", "chosen within", "the budget."],
    copy: "Creativity with adherence to established budgets. Materials chosen for how they feel, how they age, and what they cost.",
    image: { src: "/assets/images/nightSide.webp", alt: "Warmly lit interior" },
  },
  {
    bg: "#2A2725",
    fg: "#FFFFFF",
    imageSide: "right",
    lines: ["A plan", "for every", "stage."],
    copy: "Architecture, planning and engineering consultancy, carried through each stage of the design process.",
    image: { src: "/assets/images/top.webp", alt: "Residence seen from above" },
  },
];

const pad = (n) => String(n).padStart(2, "0");
const FIRST_SIDE = SLIDES[0].imageSide;

const TEXT_COL = {
  left: "lg:col-start-2 lm:col-start-2",
  right: "lg:col-start-1 lm:col-start-1",
};
const SWIPER_SIDE = {
  right: "lg:left-auto lg:right-0 lm:left-auto lm:right-0",
  left: "lg:left-0 lg:right-auto lm:left-0 lm:right-auto",
};

const counterDot =
  "flex h-12 w-12 items-center justify-center rounded-full border border-current md:h-14 md:w-14 lm:h-9 lm:w-9";

function parts(slide) {
  return {
    text: slide.querySelector(".rs-text"),
    lines: slide.querySelectorAll(".rs-line"),
    counter: slide.querySelector(".rs-counter"),
    copy: slide.querySelector(".rs-copy"),
  };
}

export default function ResidenceSlides() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector(".rs-stage");
      const swiper = root.querySelector(".rs-swiper");
      const items = gsap.utils.toArray(".rs-swiper-item", swiper);
      const imgs = gsap.utils.toArray(".rs-img", swiper);
      const slides = gsap.utils.toArray(".rs-slide", root);
      const count = slides.length;
      const first = parts(slides[0]);

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: stage, start: "top 75%", once: true },
        })
        .fromTo(first.text, { yPercent: 105 }, { yPercent: 0, duration: 1.1 }, 0)
        .fromTo(swiper, { yPercent: 105 }, { yPercent: 0, duration: 1.1 }, 0.12)
        .fromTo(imgs[0], { scale: 1.25 }, { scale: 1, duration: 1.6 }, 0.12)
        .fromTo(
          first.lines,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          0.5,
        )
        .fromTo(
          [first.counter, first.copy],
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          0.9,
        );

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop:
            "(min-width: 1024px), (orientation: landscape) and (max-height: 500px) and (max-width: 1023px)",
          mobile: "(max-width: 1023px)",
        },
        (context) => {
          let tween;
          const { desktop } = context.conditions;
          const dir = FIRST_SIDE === "right" ? -1 : 1;
          const rest = slides.slice(1).map(parts);
          gsap.set(items.slice(1), { yPercent: -100 });
          gsap.set(imgs.slice(1), { scale: 1.35, yPercent: 15 });
          gsap.set(rest.map((p) => p.text), { yPercent: 105 });
          gsap.set(rest.flatMap((p) => Array.from(p.lines)), { yPercent: 110, opacity: 0 });
          gsap.set(rest.flatMap((p) => [p.counter, p.copy]), { y: 16, opacity: 0 });

          const tl = gsap.timeline({ paused: true });
          tl.addLabel("s0", 0);
          slides.forEach((slide, i) => {
            if (i === 0) return;
            const p = parts(slide);
            const at = (i - 1) * 1.1;
            const flip = desktop && SLIDES[i].imageSide !== FIRST_SIDE;
            tl.to(
              swiper,
              { xPercent: flip ? 100 * dir : 0, x: flip ? 12 * dir : 0, duration: 0.9, ease: "power3.inOut" },
              at,
            )
              .to(items[i - 1], { yPercent: 100, duration: 0.8, ease: "power3.inOut" }, at + 0.05)
              .to(items[i], { yPercent: 0, duration: 0.8, ease: "power3.inOut" }, at + 0.05)
              .to(imgs[i], { scale: 1, yPercent: 0, duration: 0.9, ease: "power2.out" }, at + 0.05)
              .to(imgs[i - 1], { scale: 1.35, yPercent: -15, duration: 0.8, ease: "power2.in" }, at + 0.05)
              .to(p.text, { yPercent: 0, duration: 0.9, ease: "power3.inOut" }, at)
              .to(
                p.lines,
                { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
                at + 0.5,
              )
              .to(
                [p.counter, p.copy],
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power3.out" },
                at + 0.65,
              )
              .addLabel(`s${i}`, at + 1.1);
          });

          let current = 0;
          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: `+=${(count - 1) * 120 + 100}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const pos = (self.progress * ((count - 1) * 120 + 100)) / 120;
              const idx = pos < 0.3 ? 0 : Math.min(count - 1, Math.floor(pos - 0.3) + 1);
              if (idx !== current) {
                current = idx;
                tween?.kill();
                tween = tl.tweenTo(`s${idx}`, { ease: "none" });
              }
            },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="residence-slides"
      className="relative z-20 w-full text-[#2A2725] bg-[#EDE6D6]"
    >
      <div className="rs-stage relative h-screen w-full overflow-hidden p-3 md:p-5 lg:p-8 lm:p-3">
        <div className="relative h-full w-full">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="rs-slide pointer-events-none absolute inset-0 grid grid-rows-2 gap-3 lg:grid-cols-2 lg:grid-rows-1 lm:grid-cols-2 lm:grid-rows-1"
              style={{ zIndex: i + 1 }}
            >
              <div
                className={`rs-text pointer-events-auto relative flex flex-col justify-between overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-8 lg:p-10 lm:rounded-[20px] lm:p-4 ${TEXT_COL[slide.imageSide]}`}
                style={{ backgroundColor: slide.bg, color: slide.fg }}
              >
                <h2 className="font-sans text-[clamp(2rem,8vw,3.75rem)] leading-[0.95] tracking-[-0.04em] lg:text-[4.4vw] lm:text-[3.4vw]">
                  {slide.lines.map((line) => (
                    <span
                      key={line}
                      className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]"
                    >
                      <span className="rs-line block">{line}</span>
                    </span>
                  ))}
                </h2>
                <div className="flex items-end justify-between gap-6 lm:gap-3">
                  <div
                    className="rs-counter flex shrink-0 -space-x-px text-sm lm:text-xs"
                    aria-label={`Slide ${i + 1} of ${SLIDES.length}`}
                  >
                    <span className={counterDot}>{pad(i + 1)}</span>
                    <span className={`${counterDot} opacity-40`}>{pad(SLIDES.length)}</span>
                  </div>
                  <p className="rs-copy max-w-[44rem] text-2xl leading-[1.4] tracking-[-0.01em] md:text-[2rem] lm:max-w-[28rem] lm:text-[20px]">
                    {slide.copy}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div
            className={`rs-swiper absolute inset-x-0 bottom-0 isolate z-50 h-[calc(50%-6px)] overflow-hidden rounded-[28px] md:rounded-[36px] lg:inset-y-0 lg:h-auto lg:w-[calc(50%-6px)] lm:inset-y-0 lm:h-auto lm:w-[calc(50%-6px)] lm:rounded-[20px] ${SWIPER_SIDE[FIRST_SIDE]}`}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.image.src + i}
                className="rs-swiper-item absolute inset-0 overflow-hidden"
                style={{ zIndex: i + 1 }}
              >
                <img
                  src={slide.image.src}
                  alt={slide.image.alt}
                  className="rs-img h-full w-full object-cover will-change-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
