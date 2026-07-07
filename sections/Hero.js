"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, FileDown, Mail } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import { siteConfig } from "@/data/site";

const nameWords = siteConfig.name.split(" ");
const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: (index % 9) * 0.22,
  size: 2 + (index % 3)
}));

// Small helper hook — avoids pulling in an extra dependency for one media query.
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 24 });
  const gradientX = useTransform(smoothX, [-1, 1], [-26, 26]);
  const gradientY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const inverseGradientX = useTransform(gradientX, (value) => -value);

  // Only show a fraction of the particle field on mobile — 34 concurrently
  // looping animations plus blurred gradients is a lot for weaker GPUs.
  const visibleParticles = isMobile ? particles.filter((p) => p.id % 3 === 0) : particles;

  const handleMouseMove = (event) => {
    if (shouldReduceMotion || isMobile) return; // no mouse on touch devices anyway
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  // Lighter letter transition for mobile: skip the 3D rotateX tip-in (which
  // needs perspective + GPU headroom) and use a simple fade/slide instead.
  const letterInitial = shouldReduceMotion
    ? { opacity: 0 }
    : isMobile
    ? { opacity: 0, y: 14 }
    : { opacity: 0, y: 24, rotateX: -65 };

  const letterAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, rotateX: 0 };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative grid min-h-[100dvh] overflow-hidden px-5 pb-24 pt-32 md:min-h-screen md:px-8 md:pt-36"
      aria-labelledby="hero-title"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 1.1, ease: "easeOut" }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-x-0 top-[-18%] h-[58rem] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.28),transparent_58%)] blur-2xl md:inset-x-[-10%] md:blur-3xl"
          style={shouldReduceMotion || isMobile ? undefined : { x: gradientX, y: gradientY }}
        />
        <motion.div
          className="absolute bottom-[-22%] left-0 right-0 h-[48rem] w-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.18),transparent_62%)] blur-2xl md:left-auto md:right-[-8%] md:w-[58rem] md:blur-3xl"
          style={shouldReduceMotion || isMobile ? undefined : { x: inverseGradientX, y: gradientY }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_28%,rgba(34,197,94,0.08)_58%,transparent_76%)]" />
        <div className="absolute inset-0 bg-radial-grid bg-[length:34px_34px] opacity-[0.16]" />
        {visibleParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-white/42"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size
            }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.35 }
                : {
                    opacity: [0.12, 0.7, 0.16],
                    y: [-4, 8, -4]
                  }
            }
            transition={{ duration: 4.8, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      <div className="container-shell relative z-10 grid place-items-center">
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.24, duration: 0.55 }}
            className="mb-6 text-base font-semibold uppercase tracking-[0.34em] text-cyan"
          >
            Hi, I&apos;m
          </motion.p>

          <h1
            id="hero-title"
            aria-label={siteConfig.name}
            style={{ perspective: 800 }}
            className="text-gradient mx-auto min-h-[7.8rem] max-w-6xl text-balance text-5xl font-black leading-[0.98] md:min-h-[11rem] md:text-7xl lg:text-8xl xl:text-9xl"
          >
            <span aria-hidden="true">
              {nameWords.map((word, wordIndex) => (
                <span key={word} className="inline-block whitespace-nowrap">
                  {word.split("").map((letter, letterIndex) => {
                    const index = nameWords.slice(0, wordIndex).join("").length + letterIndex + wordIndex;
                    return (
                      <motion.span
                        key={`${word}-${letter}-${letterIndex}`}
                        className="inline-block"
                        initial={letterInitial}
                        animate={letterAnimate}
                        transition={{
                          delay: shouldReduceMotion ? 0 : 0.42 + index * 0.028,
                          duration: shouldReduceMotion ? 0.1 : 0.54,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                  {wordIndex < nameWords.length - 1 ? "\u00A0" : null}
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1.05, duration: 0.65 }}
            className="mt-7 text-2xl font-semibold text-white md:text-4xl"
          >
            {siteConfig.title}
          </motion.p>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1.18, duration: 0.65 }}
            className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-white/68 md:text-xl"
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1.32, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton href="#projects">
              View Projects <ArrowRight size={17} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              Contact Me <Mail size={17} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href={siteConfig.resume} download variant="secondary">
              Download Resume <FileDown size={17} aria-hidden="true" />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 z-10 grid -translate-x-1/2 place-items-center text-white/54"
        animate={shouldReduceMotion ? { opacity: 1 } : { y: [0, 8, 0], opacity: [0.48, 1, 0.48] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="grid h-11 w-7 place-items-start rounded-full border border-white/18 p-1">
          <ArrowDown size={16} className="mx-auto mt-1 text-cyan" aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  );
}