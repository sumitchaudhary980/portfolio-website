"use client";

import useVSCodeLiveStatus from "@/hooks/useVSCodeLiveStatus";

export default function VSCodeLiveBadge({ onNavigate }) {
  const status = useVSCodeLiveStatus();
  const label = status.coding ? "Coding" : "Offline";
  const mobileLabel = status.coding ? "Live" : "Offline";

  return (
    <button
      type="button"
      onClick={onNavigate}
      className={`group inline-flex h-10 w-auto max-w-[8rem] shrink-0 items-center justify-start gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-semibold text-white/72 backdrop-blur transition hover:bg-cyan/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan min-[380px]:max-w-[10rem] sm:max-w-[13rem] ${
        status.coding ? "hover:border-cyan/45" : "hover:border-white/20"
      }`}
      aria-label={`VS Code status: ${label}. Open the VS Code live section.`}
    >
      <VSCodeMark className="h-5 w-5 shrink-0 text-cyan" />
      <span className="h-1 w-1 shrink-0 rounded-full bg-white/32" aria-hidden="true" />
      {status.coding ? (
        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan shadow-[0_0_14px_rgba(6,182,212,0.7)] animate-pulse" aria-hidden="true" />
      ) : null}
      <span className="min-w-0 truncate">
        <span className={status.coding ? "hidden text-white min-[380px]:inline" : "hidden text-white/50 min-[380px]:inline"}>
          {label}
        </span>
        <span className={status.coding ? "text-white min-[380px]:hidden" : "text-white/50 min-[380px]:hidden"}>
          {mobileLabel}
        </span>
        {status.coding && status.language ? (
          <>
            <span className="hidden px-1 text-white/26 sm:inline" aria-hidden="true">-</span>
            <span className="hidden text-white/46 sm:inline">{status.language}</span>
          </>
        ) : null}
      </span>
    </button>
  );
}

function VSCodeMark({ className = "" }) {
  return (
    <svg viewBox="-2 -2 28 28" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.88 3.1 9.82 10.36 5.3 6.93a.64.64 0 0 0-.82.04L2.62 8.66a.66.66 0 0 0 0 .98L6.54 13l-3.92 3.36a.66.66 0 0 0 0 .98l1.86 1.69c.23.2.58.22.82.04l4.52-3.43 8.06 7.26a1.26 1.26 0 0 0 2.12-.9V4a1.26 1.26 0 0 0-2.12-.9Zm.18 5.3v7.2L13.18 12l4.88-3.6Z"
      />
    </svg>
  );
}
