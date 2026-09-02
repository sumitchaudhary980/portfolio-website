"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import useVSCodeLiveStatus from "@/hooks/useVSCodeLiveStatus";
import { viewportOnce } from "@/utils/motion";

function formatLabel(value, fallback = "Not available") {
  return value || fallback;
}

function formatLanguage(value) {
  if (!value) return "Not available";

  const languageMap = {
    javascript: "JavaScript",
    typescript: "TypeScript"
  };

  return languageMap[value.toLowerCase()] || value;
}

export default function VSCodeLiveSection() {
  const shouldReduceMotion = useReducedMotion();
  const status = useVSCodeLiveStatus();

  return (
    <section id="vscode-live" className="section-shell scroll-mt-24" aria-labelledby="vscode-live-title">
      <div className="container-shell">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="mx-auto max-w-4xl text-center"
        >
          <SectionHeading id="vscode-live-title" eyebrow="VS Code Live" title="Coding Status" align="center">
            A safe heartbeat from my editor showing whether I am currently coding.
          </SectionHeading>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="glass mx-auto mt-10 max-w-2xl rounded-[8px] p-5 md:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Current editor state</p>
              <h3 className="mt-3 text-3xl font-bold text-white">{status.coding ? "Coding" : "Offline"}</h3>
              <p className="mt-2 text-sm leading-6 text-white/56">
                {status.coding
                  ? `Active heartbeat received${status.project ? ` for ${status.project}` : ""}.`
                  : "No recent VS Code heartbeat has been received."}
              </p>
            </div>
            <span
              className={`h-3 w-3 shrink-0 rounded-full ${status.coding ? "bg-cyan shadow-[0_0_18px_rgba(6,182,212,0.85)]" : "bg-white/22"}`}
              aria-hidden="true"
            />
          </div>
          {status.lastSeen ? (
            <p className="mt-5 border-t border-white/10 pt-4 font-mono text-xs text-white/42">
              Last heartbeat: {new Date(status.lastSeen).toLocaleString()}
            </p>
          ) : null}
          <dl className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
            <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">Status</dt>
              <dd className="mt-2 font-semibold text-white">{status.status || (status.coding ? "Coding" : "Offline")}</dd>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">Project</dt>
              <dd className="mt-2 truncate font-semibold text-white">{formatLabel(status.project)}</dd>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">File</dt>
              <dd className="mt-2 truncate font-semibold text-white">{formatLabel(status.file)}</dd>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">Language</dt>
              <dd className="mt-2 truncate font-semibold text-white">{formatLanguage(status.language)}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
