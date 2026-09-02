"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Loader2, Send, X } from "lucide-react";

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hi! I'm Sumit's portfolio assistant. Ask me anything about his projects, skills, education, or experience."
  }
];

const maxClientMessages = 10;
const maxMessageLength = 1200;

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g);

  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={`${part}-${index}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="break-words text-cyan underline-offset-4 [overflow-wrap:anywhere] hover:underline"
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="break-words font-semibold text-white/82 [overflow-wrap:anywhere]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function MessageText({ content }) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n").filter(Boolean);
    const listItems = lines
      .map((line) => line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/)?.[1])
      .filter(Boolean);

    if (listItems.length === lines.length) {
      return (
        <ul key={`${block}-${blockIndex}`} className={blockIndex > 0 ? "mt-2 list-disc space-y-1 pl-4" : "list-disc space-y-1 pl-4"}>
          {listItems.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`${block}-${blockIndex}`} className={blockIndex > 0 ? "mt-2" : undefined}>
        {lines.map((line, lineIndex) => (
          <span key={`${line}-${lineIndex}`}>
            {renderInline(line)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = input.trim();
    if (!content || isLoading) return;

    if (content.length > maxMessageLength) {
      setInput("");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Please keep your message under 1200 characters so I can answer quickly."
        }
      ]);
      return;
    }

    const userMessage = { role: "user", content };
    const nextMessages = [...messages, userMessage].slice(-maxClientMessages);

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Assistant request failed");
      }

      setMessages((current) => [
        ...current,
        data.message || {
          role: "assistant",
          content: "Sorry, I'm temporarily unavailable. Please try again later."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I'm temporarily unavailable. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            className="glass mb-4 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-[8px] [overflow-wrap:anywhere]"
            role="dialog"
            aria-label="Portfolio assistant chat"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan/20 bg-cyan/10 text-cyan">
                  <Bot size={18} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-white">Portfolio Assistant</h2>
                  <p className="text-xs text-white/42">Ready for portfolio questions</p>
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
              <div className="grid max-h-80 min-w-0 gap-3 overflow-y-auto overflow-x-hidden pr-1">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 18)}`}
                    className={`min-w-0 max-w-full rounded-[8px] border p-3 text-sm leading-6 break-words [overflow-wrap:anywhere] ${
                      message.role === "user"
                        ? "ml-8 border-cyan/20 bg-cyan/10 text-white/78"
                        : "mr-8 border-white/10 bg-white/[0.035] text-white/68"
                    }`}
                  >
                    <MessageText content={message.content} />
                  </div>
                ))}
                {isLoading ? (
                  <div className="mr-8 flex min-w-0 max-w-full items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/68">
                    <Loader2 size={15} className="animate-spin text-cyan" aria-hidden="true" />
                    Thinking...
                  </div>
                ) : null}
              </div>
              <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
                <label htmlFor="assistant-preview-input" className="sr-only">
                  Assistant message
                </label>
                <input
                  id="assistant-preview-input"
                  name="portfolio-assistant-message"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isLoading}
                  maxLength={maxMessageLength}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="true"
                  placeholder="Ask about Sumit's work..."
                  className="min-h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70 outline-none placeholder:text-white/28 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="grid h-11 w-11 place-items-center rounded-full border border-violet/50 bg-violet text-white opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
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
