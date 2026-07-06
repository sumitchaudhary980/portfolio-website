"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/utils/motion";

export default function SectionReveal({ as = "div", className = "", children, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce()}
      variants={{
        hidden: shouldReduceMotion ? { opacity: 0 } : fadeUp.hidden,
        visible: {
          ...(shouldReduceMotion ? { opacity: 1 } : fadeUp.visible),
          transition: { ...(fadeUp.visible.transition || {}), delay }
        }
      }}
    >
      {children}
    </MotionTag>
  );
}
