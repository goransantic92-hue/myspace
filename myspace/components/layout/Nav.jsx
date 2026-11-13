"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ContactModal from "./ContactModal";
import { BRAND } from "@/lib/brand";

gsap.registerPlugin(useGSAP);

const LINKS = [
  { label: "Residence", href: "#marquee-transition" },
  { label: "Stays", href: "#residence-02" },
  { label: "Tour", href: "/tour" },
  { label: "Contact", href: "#contact" },
];

const itemClass =
  "menu-item block text-base font-bold uppercase leading-[1.15] tracking-tight";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const navRef = useRef(null);
  const menuWrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const tlRef = useRef(null);
  const closeTimer = useRef(null);
  const pointerType = useRef("mouse");

  useGSAP(
    () => {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 1 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 },
      );
    },
    { scope: navRef },
  );

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;
      const items = menu.querySelectorAll(".menu-item");
      gsap.set(menu, { height: 0 });
      gsap.set(items, { yPercent: 110 });
      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .to(menu, { height: "auto", duration: 0.5 }, 0)
        .to(items, { yPercent: 0, duration: 0.6, stagger: 0.05 }, 0.05);
    },
    { scope: menuWrapRef },
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.8).reverse();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const onPointerEnter = (e) => {
    if (e.pointerType === "mouse") {
      clearTimeout(closeTimer.current);
      setOpen(true);
    }
  };
  const onPointerLeave = (e) => {
    if (e.pointerType === "mouse") {
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setOpen(false), 150);
    }
  };
  const close = () => setOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 top-0 z-50 w-full px-6 py-4 text-white mix-blend-difference md:px-10"
      >
        <div className="flex items-start justify-between">
          <a href="/" className="text-xl font-medium leading-none">
            {BRAND}
          </a>
          <div
            ref={menuWrapRef}
            className="flex flex-col items-end"
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onBlur={(e) => {
              if (!menuWrapRef.current?.contains(e.relatedTarget)) setOpen(false);
            }}
          >
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onPointerDown={(e) => {
                pointerType.current = e.pointerType;
              }}
              onClick={(e) => {
                if (pointerType.current !== "mouse" || e.detail === 0) {
                  setOpen((v) => !v);
                }
              }}
              className="flex items-center gap-2 text-base font-bold leading-none tracking-tight"
            >
              MENU
              <span
                aria-hidden="true"
                className="grid grid-cols-2"
                style={{
                  gap: open ? 5 : 2,
                  transform: open ? "rotate(45deg)" : "none",
                  transition:
                    "gap 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                <i className="block h-[3px] w-[3px] rounded-full bg-current" />
              </span>
            </button>
            <div
              id="site-menu"
              ref={menuRef}
              className="overflow-hidden"
              style={{ height: 0 }}
              inert={!open}
            >
              <ul
                className="flex flex-col items-end pt-3 text-right"
                onMouseLeave={() => setHovered(null)}
              >
                {LINKS.map((link, i) => {
                  const isContact = link.label === "Contact";
                  const common = {
                    "data-hover-reveal": true,
                    onMouseEnter: () => setHovered(i),
                    onFocus: () => setHovered(i),
                    onBlur: () => setHovered(null),
                    className: itemClass,
                    style: {
                      opacity: hovered === null || hovered === i ? 1 : 0.4,
                      transition: "opacity 300ms",
                    },
                  };
                  const Anchor =
                    !isContact && link.href.startsWith("/") ? Link : "a";
                  return (
                    <li key={link.label} className="overflow-hidden pb-[0.1em]">
                      {isContact ? (
                        <button
                          type="button"
                          {...common}
                          onClick={() => {
                            close();
                            setContactOpen(true);
                          }}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Anchor href={link.href} onClick={close} {...common}>
                          {link.label}
                        </Anchor>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
