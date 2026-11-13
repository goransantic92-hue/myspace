"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  ENQUIRY_SUBJECT,
  SOCIAL_LINKS,
  telHref,
} from "@/lib/brand";
import Logo from "./Logo";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  SOCIAL_ICONS,
} from "./icons";

const INQUIRIES = [
  {
    key: "architecture",
    label: "Architecture",
    title: "Start a project",
    note: "Site, brief, budget",
    subject: ENQUIRY_SUBJECT,
  },
  {
    key: "consultancy",
    label: "Planning & engineering",
    title: "Ask about consultancy",
    note: "Scope and questions",
    subject: ENQUIRY_SUBJECT,
  },
];

function SocialLink({ label, href }) {
  const Icon = SOCIAL_ICONS[label];
  const external = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={label}
        className="flex items-center gap-2 rounded-full border border-[#EDE6D6]/20 p-2.5 text-xs text-[#EDE6D6]/75 transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] focus-visible:bg-[#EDE6D6] focus-visible:text-[#2A2725] focus-visible:outline-none sm:px-4 sm:py-2"
      >
        <Icon size={14} aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </a>
    </li>
  );
}

function InquiryCard({ label, title, note, subject }) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`}
      className="cx-fade group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6] md:rounded-3xl md:px-6 md:py-5 [@media(orientation:landscape)_and_(max-height:500px)]:px-4 [@media(orientation:landscape)_and_(max-height:500px)]:py-2.5"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-[#EDE6D6] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="relative z-10 flex flex-col gap-1 transition-colors duration-500 group-hover:text-[#2A2725] group-focus-visible:text-[#2A2725]">
        <span className="text-xs opacity-60">
          {label} · {note}
        </span>
        <span className="font-serif text-[clamp(1.35rem,min(2.6vw,4vh),2rem)] leading-tight tracking-[-0.02em]">
          {title}
        </span>
      </span>
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/30 transition-colors duration-500 group-hover:text-[#2A2725] group-focus-visible:text-[#2A2725]">
        <ArrowUpRightIcon
          aria-hidden="true"
          size={18}
          className="transition-transform duration-500 group-hover:rotate-45"
        />
      </span>
    </a>
  );
}

export default function ContactModal({ open, onClose }) {
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const copyTimer = useRef(null);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(open);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  useLayoutEffect(() => {
    if (!mounted || !open || !rootRef.current) return;
    const el = rootRef.current;
    const q = gsap.utils.selector(el);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(q(".cx-content"), { opacity: 1 });
    gsap.set(q(".cx-mask"), { yPercent: 110 });
    gsap.set(q(".cx-fade"), { opacity: 0, y: 14 });
    gsap.set(q(".cx-line"), { scaleX: 0 });
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
    });
    if (reduced) {
      tl.set(q(".cx-mask"), { yPercent: 0 })
        .set(q(".cx-fade"), { opacity: 1, y: 0 })
        .set(q(".cx-line"), { scaleX: 1 })
        .to(el, { clipPath: "inset(0% 0 0 0)", duration: 0.25, ease: "none" });
    } else {
      tl.to(el, { clipPath: "inset(0% 0 0 0)", duration: 0.95, ease: "expo.inOut" }, 0)
        .to(q(".cx-line"), { scaleX: 1, duration: 0.9, stagger: 0.08, ease: "power3.inOut" }, 0.55)
        .to(q(".cx-mask"), { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "expo.out" }, 0.6)
        .to(q(".cx-fade"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.8);
    }
    return () => tl.kill();
  }, [mounted, open]);

  useEffect(() => {
    if (open || !mounted || !rootRef.current) return;
    const el = rootRef.current;
    const q = gsap.utils.selector(el);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(el, { clipPath: "inset(0% 0 0 0)" });
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    if (reduced) tl.to(el, { opacity: 0, duration: 0.2, ease: "none" });
    else
      tl.to(q(".cx-content"), { opacity: 0, duration: 0.3, ease: "power2.in" }).to(
        el,
        { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "expo.inOut" },
        0.1,
      );
    return () => tl.kill();
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !open) return;
    const previous = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const focusable = rootRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [mounted, open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CONTACT_EMAIL;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      ta.remove();
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999] h-[100svh] overflow-hidden bg-[#2A2725] text-[#EDE6D6] [@media(orientation:landscape)_and_(max-height:500px)]:overflow-y-auto [@media(orientation:landscape)_and_(max-height:500px)]:overscroll-contain"
      style={{ clipPath: "inset(100% 0 0 0)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
      data-lenis-prevent
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#EDE6D6]/[0.06] blur-3xl"
      />
      <div className="cx-content relative mx-auto flex h-full w-full max-w-[1280px] flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:px-10 md:pb-6 [@media(orientation:landscape)_and_(max-height:500px)]:h-auto [@media(orientation:landscape)_and_(max-height:500px)]:min-h-full [@media(orientation:landscape)_and_(max-height:500px)]:pt-2 [@media(orientation:landscape)_and_(max-height:500px)]:pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(orientation:landscape)_and_(max-height:500px)]:pl-[max(1.25rem,env(safe-area-inset-left))] [@media(orientation:landscape)_and_(max-height:500px)]:pr-[max(1.25rem,env(safe-area-inset-right))]">
        <div className="flex items-center justify-between">
          <span className="cx-fade text-lg font-medium leading-none">
            <Logo />
          </span>
          <div className="cx-fade flex items-center gap-3">
            <kbd className="hidden rounded-md border border-[#EDE6D6]/25 px-1.5 py-1 font-sans text-[10px] font-medium leading-none text-[#EDE6D6]/50 md:block">
              Esc
            </kbd>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onCloseRef.current?.()}
              aria-label="Close contact"
              className="group flex items-center gap-2 rounded-full border border-[#EDE6D6]/25 py-2 pl-4 pr-3 text-sm font-semibold leading-none transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6]"
            >
              Close
              <span
                aria-hidden="true"
                className="relative block h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90"
              >
                <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>
          </div>
        </div>

        <main className="grid min-h-0 flex-1 content-center gap-6 py-4 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14 [@media(orientation:landscape)_and_(max-height:500px)]:grid-cols-[1.25fr_1fr] [@media(orientation:landscape)_and_(max-height:500px)]:items-center [@media(orientation:landscape)_and_(max-height:500px)]:gap-6 [@media(orientation:landscape)_and_(max-height:500px)]:py-2">
          <div>
            <div className="cx-fade inline-flex items-center gap-2 rounded-full border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-3 py-1.5 text-xs text-[#EDE6D6]/80">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9ED8A8]"
              />
              Architectural consultancy, Dubai
            </div>
            <h2 className="mt-4 font-serif text-[clamp(2rem,min(5.4vw,8.5vh),4.5rem)] leading-[1] tracking-[-0.03em] [@media(orientation:landscape)_and_(max-height:500px)]:mt-2 [@media(orientation:landscape)_and_(max-height:500px)]:text-[clamp(1.5rem,9vh,2.25rem)]">
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="cx-mask block">Tell us about</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] text-[#EDE6D6]/50">
                <span className="cx-mask block">your project.</span>
              </span>
            </h2>
            <p className="cx-fade mt-4 max-w-md text-sm leading-relaxed text-[#EDE6D6]/65 md:text-[15px] [@media(orientation:landscape)_and_(max-height:500px)]:hidden">
              A residence to design, a site to plan, or a question about
              engineering? Write to us, or call{" "}
              <a
                href={telHref(CONTACT_PHONE)}
                className="whitespace-nowrap underline decoration-[#EDE6D6]/30 underline-offset-4 transition-colors hover:text-[#EDE6D6]"
              >
                {CONTACT_PHONE}
              </a>
              .
            </p>
            <div className="cx-fade mt-5 flex max-w-full items-center justify-between gap-2 rounded-full border border-[#EDE6D6]/25 bg-[#EDE6D6]/[0.04] p-1.5 pl-5 sm:inline-flex sm:gap-6 [@media(orientation:landscape)_and_(max-height:500px)]:mt-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex min-w-0 items-center gap-2 text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6] md:text-lg"
              >
                <span className="truncate">{CONTACT_EMAIL}</span>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-live="polite"
                className="flex shrink-0 items-center gap-2 rounded-full bg-[#EDE6D6] px-4 py-2.5 text-xs font-semibold text-[#2A2725] transition-opacity duration-300 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE6D6]"
              >
                {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 [@media(orientation:landscape)_and_(max-height:500px)]:gap-2">
            {INQUIRIES.map((item) => (
              <InquiryCard key={item.key} {...item} />
            ))}
          </div>
        </main>

        <div>
          <div className="cx-line h-px origin-left bg-[#EDE6D6]/20" />
          <div className="flex items-center justify-between gap-4 pt-4 [@media(orientation:landscape)_and_(max-height:500px)]:pt-2">
            <ul className="cx-fade flex items-center gap-2">
              {SOCIAL_LINKS.map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </ul>
            <span className="cx-fade hidden text-xs text-[#EDE6D6]/45 sm:block">
              {ADDRESS}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
