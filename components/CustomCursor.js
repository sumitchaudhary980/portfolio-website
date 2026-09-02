"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 420, damping: 36 });
  const springY = useSpring(y, { stiffness: 420, damping: 36 });

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(canHover && !shouldReduceMotion);
    if (!canHover || shouldReduceMotion) return undefined;

    const handleMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target.closest?.("a, button, [data-cursor]");
      setLabel(target?.dataset?.cursor || (target?.tagName === "A" ? "->" : ""));
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [shouldReduceMotion, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/50 bg-ink/80 text-[10px] font-bold text-cyan shadow-cyan backdrop-blur md:flex"
      style={{ x: springX, y: springY, width: label ? 46 : 14, height: label ? 46 : 14 }}
      aria-hidden="true"
    >
      {label}
    </motion.div>
  );
}
