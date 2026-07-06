"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function MagneticButton({
  href,
  children,
  className = "",
  download = false,
  target,
  rel,
  variant = "primary"
}) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.3 });

  const handleMouseMove = (event) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles =
    variant === "secondary"
      ? "border-white/15 bg-white/[0.04] text-white hover:border-cyan/60 hover:bg-cyan/10"
      : "border-violet/50 bg-violet text-white shadow-glow hover:border-cyan/70 hover:bg-cyan";

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      target={target}
      rel={rel}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
      whileTap={{ scale: 0.98 }}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${styles} ${className}`}
    >
      {children}
    </motion.a>
  );
}
