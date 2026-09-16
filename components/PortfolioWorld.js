"use client";

import { useEffect, useRef } from "react";

// Paint HTML first, then load one shared renderer during idle time.
export default function PortfolioWorld() {
  const host = useRef(null);
  useEffect(() => {
    let disposed = false;
    let cleanup;
    const start = () => import("@/utils/portfolioWorld").then(({ createPortfolioWorld }) => {
      if (!disposed) cleanup = createPortfolioWorld(host.current);
    }).catch(() => { /* CSS orbital background and HTML remain available. */ });
    const idle = window.requestIdleCallback?.(start, { timeout: 1600 });
    const timer = idle === undefined ? window.setTimeout(start, 250) : null;
    return () => { disposed = true; if (idle !== undefined) window.cancelIdleCallback(idle); clearTimeout(timer); cleanup?.(); };
  }, []);
  return <div ref={host} className="portfolio-world" aria-hidden="true" />;
}
