"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactModal from "@/components/layout/ContactModal";
import Logo from "@/components/layout/Logo";
import {
  ADDRESS,
  BRAND_TITLE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_ALT,
  HOURS,
  LOCATIONS,
  SOCIAL_LINKS,
  telHref,
} from "@/lib/brand";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const linkClass =
  "footer-reveal block py-1 transition-opacity hover:opacity-60 lg:py-0 lm:py-0.5";
const headingClass =
  "footer-reveal text-xs uppercase tracking-[0.12em] text-[#2A2725]/65 lm:text-[10px]";
const ruleClass = "footer-rule my-8 h-px origin-left scale-x-0 bg-[#2A2725]/20 md:my-16 lm:my-3";

function FooterText({ children }) {
  return (
    <div className="overflow-hidden">
      <p className="footer-reveal block py-1 lg:py-0 lm:py-0.5">{children}</p>
    </div>
  );
}

function FooterLink({ label, href }) {
  const external = href.startsWith("http");
  return (
    <div className="overflow-hidden">
      <a
        data-hover-reveal
        className={linkClass}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {label}
      </a>
    </div>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: window.innerWidth < 1024 ? "top 92%" : "top 82%",
            once: true,
          },
        })
        .fromTo(
          ".footer-frame",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.inOut" },
        )
        .fromTo(
          ".footer-rule",
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left center", duration: 0.7, ease: "power3.out" },
          "-=0.65",
        )
        .fromTo(
          ".footer-reveal",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out" },
          "-=0.35",
        );
    },
    { scope: ref },
  );

  return (
    <>
      <footer
        ref={ref}
        id="contact"
        className="relative z-30 flex min-h-[100svh] w-full flex-col bg-[#EDE6D6] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-[#2A2725] md:px-10 md:py-6 lg:block lg:h-screen lg:py-16 lm:px-4 lm:pb-3 lm:pt-3"
      >
        <div className="footer-frame flex flex-1 flex-col justify-between rounded-[20px] border border-[#2A2725]/20 px-5 py-6 md:rounded-[30px] md:px-10 md:py-10 lg:block lm:rounded-[20px] lm:px-5 lm:py-3">
          <div className="flex items-start justify-between gap-8 text-xs uppercase tracking-[0.12em] md:text-sm lm:text-xs">
            <div className="overflow-hidden">
              <Link href="/" aria-label={`${BRAND_TITLE} home`} className="footer-reveal block text-lg md:text-xl lm:text-base">
                <Logo />
              </Link>
            </div>
            <div className="hidden overflow-hidden md:block">
              <span className="footer-reveal block text-right">Architectural Consultancy, Dubai</span>
            </div>
          </div>
          <div className={ruleClass} />

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-16 lm:grid-cols-[1fr_auto] lm:gap-8">
            <div>
              <div className="overflow-hidden">
                <h2 className="footer-reveal max-w-[12ch] font-serif text-[clamp(3rem,13vw,7rem)] leading-[0.88] tracking-[-0.03em] lg:text-[clamp(2.75rem,8vw,7rem)] lm:text-[2.5rem]">
                  Architecture, planning, engineering.
                </h2>
              </div>
              <div className="overflow-hidden">
                <p className="footer-reveal mt-6 max-w-xl text-lg leading-[1.2] md:text-xl lm:mt-2 lm:text-sm">
                  Private residences across Dubai: {LOCATIONS.join(", ")}.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm md:gap-12 lg:min-w-[360px] lg:gap-20 lg:text-base lm:min-w-[260px] lm:gap-10 lm:text-xs">
              <div className="flex flex-col gap-4 lm:gap-1">
                <div className="overflow-hidden">
                  <p className={headingClass}>Office</p>
                </div>
                <FooterText>{BRAND_TITLE}</FooterText>
                {ADDRESS.split(", ").map((line) => (
                  <FooterText key={line}>{line}</FooterText>
                ))}
              </div>
              <div className="flex flex-col gap-4 lm:gap-1">
                <div className="overflow-hidden">
                  <p className={headingClass}>Contact</p>
                </div>
                <FooterLink label={CONTACT_PHONE} href={telHref(CONTACT_PHONE)} />
                <FooterLink label={CONTACT_PHONE_ALT} href={telHref(CONTACT_PHONE_ALT)} />
                <FooterLink label={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
                {SOCIAL_LINKS.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </div>
          </div>
          <div className={ruleClass} />

          <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.12em] lg:flex-row lg:items-center lg:justify-between lg:text-sm lm:flex-row lm:items-center lm:justify-between lm:gap-3 lm:text-[11px]">
            <div className="flex flex-col gap-1.5">
              <div className="overflow-hidden">
                <p className="footer-reveal">© {BRAND_TITLE} 2026</p>
              </div>
              <div className="overflow-hidden">
                <p className="footer-reveal text-[10px] tracking-[0.12em] text-[#2A2725]/55 md:text-[11px] lm:text-[9px]">
                  {HOURS}
                </p>
              </div>
            </div>
            <div className="-m-2 overflow-hidden p-2">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="footer-reveal flex items-center gap-2.5 py-1 text-[11px] tracking-[0.12em] text-[#2A2725]/70 transition-opacity hover:opacity-60 lg:py-0"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FA85B]/70"
                  />
                  <span
                    aria-hidden="true"
                    className="relative inline-flex h-2 w-2 rounded-full bg-[#3FA85B]"
                  />
                </span>
                <span data-hover-reveal>Project enquiry</span>
              </button>
            </div>
            <div className="overflow-hidden">
              <a data-hover-reveal className="footer-reveal block py-1 transition-opacity hover:opacity-60 lg:py-0"
                href="#top"
              >
                Back to top
              </a>
            </div>
          </div>
        </div>
      </footer>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
