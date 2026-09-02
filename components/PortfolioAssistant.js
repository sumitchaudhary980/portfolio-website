"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            className="glass mb-4 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-[8px]"
            role="dialog"
            aria-label="Portfolio assistant preview"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan/20 bg-cyan/10 text-cyan">
                  <Bot size={18} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-white">Portfolio Assistant</h2>
                  <p className="text-xs text-white/42">Prepared for /api/assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/68 transition hover:border-cyan/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                aria-label="Close assistant"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="p-4">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/68">
                Hi! I&apos;m Sumit&apos;s portfolio assistant. Ask me anything about his projects, skills, education, or experience.
              </div>
              <form className="mt-4 flex gap-2" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="assistant-preview-input" className="sr-only">
                  Assistant message
                </label>
                <input
                  id="assistant-preview-input"
                  disabled
                  placeholder="API not connected yet"
                  className="min-h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white/50 outline-none"
                />
                <button
                  type="submit"
                  disabled
                  className="grid h-11 w-11 place-items-center rounded-full border border-violet/50 bg-violet text-white opacity-70"
                  aria-label="Send message"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="grid h-14 w-14 place-items-center rounded-full border border-cyan/30 bg-ink/90 text-cyan shadow-cyan backdrop-blur-xl transition hover:border-cyan hover:bg-cyan hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        aria-label={isOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
        aria-expanded={isOpen}
      >
        <Bot size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
