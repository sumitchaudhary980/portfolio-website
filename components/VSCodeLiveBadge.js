"use client";

import useVSCodeLiveStatus from "@/hooks/useVSCodeLiveStatus";

export default function VSCodeLiveBadge({ onNavigate }) {
  const status = useVSCodeLiveStatus();
  const label = status.coding ? "Coding" : "Offline";
  const mobileLabel = status.coding ? "Live" : "Offline";
  const projectLabel = status.coding && status.project ? status.project : "";
  const desktopLabel = projectLabel ? `${label} - ${projectLabel}` : label;

  return (
    <button
      type="button"
      onClick={onNavigate}
      className={`group inline-flex h-10 w-auto max-w-[5.75rem] shrink-0 items-center justify-start gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 text-left text-xs font-semibold text-white/72 backdrop-blur transition hover:bg-cyan/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan min-[380px]:max-w-[9rem] sm:max-w-[13rem] sm:gap-2 sm:px-3 lg:max-w-[15rem] xl:max-w-[18rem] 2xl:max-w-[22rem] ${
        status.coding ? "hover:border-cyan/45" : "hover:border-white/20"
      }`}
      aria-label={`VS Code status: ${projectLabel ? `${label} in ${projectLabel}` : label}. Open the VS Code live section.`}
    >
      <VSCodeMark className="h-5 w-5 shrink-0 text-cyan" />
      <span className="h-1 w-1 shrink-0 rounded-full bg-white/32" aria-hidden="true" />
      {status.coding ? (
        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan shadow-[0_0_14px_rgba(6,182,212,0.7)] animate-pulse" aria-hidden="true" />
      ) : null}
      <span className="min-w-0 overflow-hidden whitespace-nowrap">
        <span className={status.coding ? "block truncate text-white min-[380px]:hidden" : "block truncate text-white/50 min-[380px]:hidden"}>
          {mobileLabel}
        </span>
        <span className={status.coding ? "hidden truncate text-white min-[380px]:block sm:hidden" : "hidden truncate text-white/50 min-[380px]:block sm:hidden"}>
          {label}
        </span>
        <span className={status.coding ? "hidden truncate text-white sm:block" : "hidden truncate text-white/50 sm:block"}>
          {desktopLabel}
        </span>
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
