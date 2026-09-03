"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, siteConfig } from "@/data/site";
import useSpotifyNowPlaying from "@/hooks/useSpotifyNowPlaying";
import VSCodeLiveBadge from "@/components/VSCodeLiveBadge";
import ThemeToggle from "@/components/ThemeToggle";

const sectionIds = navItems.map((item) => item.href.replace("#", ""));

export default function Header() {
  const [active, setActive] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { status: spotifyStatus, track: spotifyTrack } = useSpotifyNowPlaying();

  // Header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active nav item while scrolling
  useEffect(() => {
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      let currentSection = sectionIds[0];

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (!section) return;

        if (scrollPosition >= section.offsetTop) {
          currentSection = id;
        }
      });

      // Keep last section active when at bottom
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 5
      ) {
        currentSection = sectionIds[sectionIds.length - 1];
      }

      setActive(currentSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  const scrollToSpotify = () => {
    closeMenu();
    window.setTimeout(() => {
      document.getElementById("spotify-now-listening")?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start"
      });
    }, isOpen ? 80 : 0);
  };

  const scrollToVSCode = () => {
    closeMenu();
    window.setTimeout(() => {
      document.getElementById("vscode-live")?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start"
      });
    }, isOpen ? 80 : 0);
  };

  const isSpotifyPlaying = spotifyStatus === "ready" && spotifyTrack?.hasTrack && spotifyTrack.isPlaying;
  const spotifyLabel = isSpotifyPlaying ? spotifyTrack.title : "Not Listening";
  const spotifyArtist = isSpotifyPlaying ? spotifyTrack.artist : "";
  const spotifyDisplay = spotifyArtist
    ? `${spotifyLabel} - ${spotifyArtist}`
    : spotifyLabel;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-ink/70 shadow-2xl shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <nav
        className="mx-auto grid h-auto min-h-20 w-full max-w-[110rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 min-[431px]:h-20 min-[431px]:py-0 sm:gap-4 sm:px-5 md:px-8"
        aria-label="Primary"
      >
        <a
          href="#home"
          className="group flex shrink-0 items-center gap-3 max-[430px]:col-start-1 max-[430px]:row-start-1"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-white/8 text-sm font-black text-white shadow-cyan transition group-hover:border-cyan/60">
            SK
          </span>

          <span className="hidden text-sm font-semibold text-white/88 sm:block">
            Sumit
          </span>
        </a>

        <div className="hidden min-w-0 max-w-full justify-self-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActive(id)}
                className="relative rounded-full px-3 py-2 text-sm font-medium text-white/64 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan 2xl:px-4"
              >
                <span className="relative z-10">{item.label}</span>

                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 360,
                            damping: 32,
                          }
                    }
                  />
                )}

                <span
                  className={`absolute bottom-1.5 left-4 right-4 h-px origin-left rounded-full bg-cyan transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="contents min-[431px]:flex min-[431px]:min-w-0 min-[431px]:items-center min-[431px]:justify-end min-[431px]:gap-1 min-[431px]:justify-self-end sm:gap-2 lg:gap-3">
          <div className="flex min-w-0 items-center justify-center gap-1 max-[430px]:col-span-3 max-[430px]:row-start-2 max-[430px]:w-full min-[431px]:justify-end sm:gap-2 lg:gap-3">
            <button
              type="button"
              onClick={scrollToSpotify}
              className={`group inline-flex h-10 w-auto max-w-[9rem] shrink-0 items-center justify-start gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 text-left text-xs font-semibold text-white/72 backdrop-blur transition hover:bg-green/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan min-[380px]:max-w-[11rem] sm:max-w-[14rem] sm:gap-2 sm:px-3 lg:max-w-[16rem] xl:max-w-[17rem] 2xl:max-w-[20rem] ${
                isSpotifyPlaying ? "hover:border-green/45" : "hover:border-white/20"
              }`}
              aria-label={
                isSpotifyPlaying
                  ? `Now listening to ${spotifyTrack.title} by ${spotifyTrack.artist}. Open the Spotify section.`
                  : "Spotify status: Not Listening. Open the Spotify section."
              }
            >
              <SpotifyMark className="h-5 w-5 shrink-0 text-green" />
              <span className="h-1 w-1 shrink-0 rounded-full bg-white/32" aria-hidden="true" />
              {isSpotifyPlaying && spotifyTrack.albumArt ? (
                <img
                  src={spotifyTrack.albumArt}
                  alt=""
                  className="h-5 w-5 shrink-0 rounded-full object-cover min-[431px]:h-6 min-[431px]:w-6"
                  loading="lazy"
                />
              ) : null}
              {isSpotifyPlaying ? (
                <span className="hidden shrink-0 items-center gap-0.5 min-[420px]:flex" aria-hidden="true">
                  <span className="h-2 w-0.5 animate-pulse rounded-full bg-green" />
                  <span className="h-3 w-0.5 animate-pulse rounded-full bg-cyan [animation-delay:120ms]" />
                  <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-violet [animation-delay:240ms]" />
                </span>
              ) : null}
              <span className="min-w-0 overflow-hidden whitespace-nowrap">
                <span className={`block truncate sm:hidden ${isSpotifyPlaying ? "text-white" : "text-white/50"}`}>
                  {spotifyLabel}
                </span>
                <span className={`hidden truncate sm:block ${isSpotifyPlaying ? "text-white" : "text-white/50"}`}>
                  {spotifyDisplay}
                </span>
              </span>
            </button>

            <VSCodeLiveBadge onNavigate={scrollToVSCode} />
          </div>

          <ThemeToggle />

          <button
            type="button"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[0.05] text-white backdrop-blur max-[430px]:col-start-3 max-[430px]:row-start-1 max-[430px]:justify-self-end"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            className="border-y border-white/10 bg-ink/94 px-5 py-5 backdrop-blur-xl"
          >
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => {
                const id = item.href.replace("#", "");

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setActive(id);
                      closeMenu();
                    }}
                    className="rounded-2xl px-4 py-3 text-base font-semibold text-white/76 transition hover:bg-white/8 hover:text-white"
                  >
                    {item.label}
                  </a>
                );
              })}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SpotifyMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.76.76 0 0 1-1.04.25 9.4 9.4 0 0 0-5.18-1.2 12.17 12.17 0 0 0-2.92.48.76.76 0 0 1-.44-1.45 13.8 13.8 0 0 1 3.3-.55 10.77 10.77 0 0 1 5.94 1.42c.36.22.47.69.25 1.05Zm1.23-2.73a.9.9 0 0 1-1.24.3 11.91 11.91 0 0 0-6.27-1.47 13.67 13.67 0 0 0-3.56.58.9.9 0 0 1-.53-1.72 15.35 15.35 0 0 1 4.03-.66 13.56 13.56 0 0 1 7.27 1.73.9.9 0 0 1 .3 1.24Zm.13-2.9a15.51 15.51 0 0 0-8.15-1.74 16.33 16.33 0 0 0-3.94.6 1.04 1.04 0 1 1-.6-1.98 18.15 18.15 0 0 1 4.46-.69 17.48 17.48 0 0 1 9.22 2 1.04 1.04 0 1 1-.99 1.82Z"
      />
    </svg>
  );
}
