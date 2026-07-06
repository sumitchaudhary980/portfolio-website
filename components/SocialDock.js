"use client";

import { motion, useReducedMotion } from "framer-motion";
import { socialLinks } from "@/data/site";

export default function SocialDock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 overflow-visible xl:flex 2xl:left-5" aria-label="Social links">
      {socialLinks.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.a
            key={item.label}
            href={item.href}
            download={item.download}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.8 + index * 0.08 }}
            whileHover={shouldReduceMotion ? undefined : { x: 4, scale: 1.04 }}
            className="group relative grid h-10 w-10 place-items-center overflow-visible rounded-full border border-white/12 bg-ink/80 text-white/72 backdrop-blur-xl transition hover:border-cyan/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan 2xl:h-11 2xl:w-11"
          >
            <span className="pointer-events-none absolute inset-1 rounded-full bg-cyan/20 opacity-0 blur-[10px] transition duration-300 group-hover:opacity-100" aria-hidden="true" />
            <Icon className="relative z-10" size={17} aria-hidden="true" />
            <span className="pointer-events-none absolute left-11 min-w-max rounded-full border border-white/10 bg-ink/95 px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100 2xl:left-12">
              {item.label}
            </span>
            <span className="sr-only">{item.label}</span>
          </motion.a>
        );
      })}
    </aside>
  );
}