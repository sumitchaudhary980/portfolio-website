"use client";

import { ArrowUp } from "lucide-react";
import { siteConfig, socialLinks } from "@/data/site";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer-socials" className="relative z-10 overflow-hidden border-t border-white/10 px-5 py-6 md:px-8">
      {/* signature top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Top Section: Everything stacked closely without massive side gaps */}
        <div className="flex flex-col items-center gap-2 pb-5">
          <a href="#home" className="text-base font-bold text-white tracking-wide">
            {siteConfig.name}
          </a>
          <p className="max-w-md text-xs text-white/58 leading-relaxed">
            {siteConfig.tagline}
          </p>

          {/* Contact Details & Socials unified inline */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/58">
            <a href={`mailto:${siteConfig.email}`} className="transition hover:text-cyan break-all">
              {siteConfig.email}
            </a>
            <span className="text-white/20 hidden sm:inline" aria-hidden="true">•</span>
            <span className="text-white/40">{siteConfig.location}</span>
          </div>

          {/* Compact Social Badges */}
          <div className="mt-2 flex items-center justify-center gap-2">
            {socialLinks.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group relative grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-ink/40 text-white/62 transition hover:border-cyan/50 hover:text-white"
                  aria-label={item.label}
                >
                  <span
                    className="pointer-events-none absolute inset-0.5 rounded-full bg-cyan/18 opacity-0 blur-[6px] transition duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <Icon className="relative z-10" size={13} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Tight layout with copyright exactly in the center */}
        <div className="grid grid-cols-3 items-center border-t border-white/10 pt-4 gap-2">
          {/* Empty spacer block to perfectly center the copyright text */}
          <div className="w-full" aria-hidden="true" />
          
          {/* Centered Copyright on one line */}
          <p className="text-[11px] sm:text-xs text-white/42 whitespace-nowrap text-center">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>

          {/* Right Aligned Back to Top */}
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/62 transition hover:border-cyan/50 hover:text-white whitespace-nowrap sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <span className="hidden sm:inline">Back to top</span>
              <ArrowUp size={11} className="transition group-hover:-translate-y-0.5 sm:size-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}