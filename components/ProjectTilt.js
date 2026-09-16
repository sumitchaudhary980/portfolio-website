"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function ProjectTilt({ children }) {
  const host = useRef(null);
  const reduced = useReducedMotion();
  const reset = () => { host.current?.style.setProperty("--tilt-x", "0deg"); host.current?.style.setProperty("--tilt-y", "0deg"); };
  const move = (event) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    host.current.style.setProperty("--tilt-x", `${(0.5 - (event.clientY - rect.top) / rect.height) * 5}deg`);
    host.current.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`);
  };
  return <div ref={host} className="project-tilt" onPointerMove={move} onPointerLeave={reset} onBlur={reset}>{children}</div>;
}
