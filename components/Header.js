"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileDown, Menu, X } from "lucide-react";
import { navItems, siteConfig } from "@/data/site";

const sectionIds = navItems.map((item) => item.href.replace("#", ""));

export default function Header() {
  const [active, setActive] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.24, 0.36, 0.5], rootMargin: "-18% 0px -58% 0px" }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "border-b border-white/10 bg-ink/70 shadow-2xl shadow-black/20 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Primary">
        <a href="#home" className="group flex items-center gap-3" aria-label={`${siteConfig.name} home`}>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-white/8 text-sm font-black text-white shadow-cyan transition group-hover:border-cyan/60">
            SK
          </span>
          <span className="hidden text-sm font-semibold text-white/88 sm:block">Sumit</span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl lg:flex">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;

            return (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-white/64 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <span className="relative z-10">{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 32 }}
                  />
                ) : null}
                <span
                  className={`absolute bottom-1.5 left-4 right-4 h-px origin-left rounded-full bg-cyan transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.resume}
            download
            className="hidden min-h-11 items-center gap-2 rounded-full border border-violet/50 bg-violet px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:border-cyan/60 hover:bg-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan sm:inline-flex"
          >
            <FileDown size={16} aria-hidden="true" />
            Resume
          </a>
          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.05] text-white backdrop-blur lg:hidden"
          >
            {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            className="border-y border-white/10 bg-ink/94 px-5 py-5 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-white/76 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={siteConfig.resume}
                download
                onClick={closeMenu}
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white"
              >
                <FileDown size={17} aria-hidden="true" />
                Download Resume
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
