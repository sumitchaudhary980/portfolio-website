"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Pause, Play } from "lucide-react";
import { navItems, siteConfig } from "@/data/site";
import VSCodeLiveBadge from "@/components/VSCodeLiveBadge";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const menuButton = useRef(null);
  const menu = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let frame;
    let offsets = [];
    const update = () => {
      const position = window.scrollY + window.innerHeight * 0.35;
      setActive(offsets.filter((item) => item.top <= position).at(-1)?.id || "home");
    };
    const measure = () => {
      offsets = navItems.map(({ href }) => ({ id: href.slice(1), top: (document.querySelector(href)?.getBoundingClientRect().top || 0) + window.scrollY }));
      update();
    };
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(document.querySelector("main"));
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    menu.current?.querySelector("a")?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") { setIsOpen(false); menuButton.current?.focus(); }
    };
    const resize = () => { if (window.innerWidth >= 1200) setIsOpen(false); };
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => { document.removeEventListener("keydown", keydown); window.removeEventListener("resize", resize); };
  }, [isOpen]);

  const link = (item) => (
    <a key={item.href} href={item.href} aria-current={active === item.href.slice(1) ? "location" : undefined}
      onClick={() => { setActive(item.href.slice(1)); setIsOpen(false); }}>
      {item.label}
    </a>
  );

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="header-inner" aria-label="Primary">
        <a href="#home" className="brand" aria-label={siteConfig.name + " home"}><span>SK<span className="text-cyan">.</span></span><span className="brand-name">Sumit</span></a>
        <div className="desktop-nav">{navItems.map(link)}</div>
        <div className="header-tools">
          <VSCodeLiveBadge onNavigate={() => { setIsOpen(false); document.getElementById("vscode-live")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" }); }} />
          <button type="button" className="motion-toggle" aria-label={paused ? "Resume scene animation" : "Pause scene animation"} aria-pressed={paused}
            onClick={() => { const next = !paused; setPaused(next); document.documentElement.dataset.motion = next ? "paused" : "running"; }}>
            {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
          </button>
          <ThemeToggle />
          <button ref={menuButton} type="button" className="menu-toggle" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && <motion.nav ref={menu} id="mobile-navigation" aria-label="Mobile" className="mobile-nav" initial={{ opacity: 0, y: reduced ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>{navItems.map(link)}</motion.nav>}
      </AnimatePresence>
    </header>
  );
}
