"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { contactMethods, siteConfig } from "@/data/site";
import { viewportOnce } from "@/utils/motion";

const initialState = {
  name: "",
  email: "",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || form.message.trim().length < 10) {
      setStatus("Please add your name, a valid email, and a message with at least 10 characters.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setStatus("Opening your email app with the message ready to send.");
    setForm(initialState);
  };

  return (
    <section id="contact" className="section-shell" aria-labelledby="contact-title">
      <div className="container-shell">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="mx-auto max-w-4xl text-center"
        >
          <SectionHeading id="contact-title" eyebrow="Contact" title="Let's Build Something Amazing Together" align="center">
            Have an idea, role, or product challenge? I would love to hear what you are building.
          </SectionHeading>
        </motion.div>

        <div className="mt-14 grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce()}
            className="grid gap-4"
          >
            {contactMethods.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="glass group flex min-w-0 items-center gap-3 rounded-[8px] p-4 transition hover:border-cyan/40 hover:bg-cyan/10 sm:gap-4 sm:p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cyan/20 bg-cyan/10 text-cyan sm:h-12 sm:w-12">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/42 sm:text-sm sm:tracking-[0.18em]">{item.label}</span>
                    <span className="mt-1 block text-sm font-semibold text-white [overflow-wrap:anywhere] group-hover:text-cyan sm:text-base">
                      {item.value}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto hidden text-white/32 transition group-hover:translate-x-1 group-hover:text-cyan sm:block" size={18} aria-hidden="true" />
                </a>
              );
            })}
          </motion.div>

          <motion.form
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce()}
            onSubmit={handleSubmit}
            className="glass rounded-[8px] p-5 md:p-7"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-white/70">
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="min-h-12 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-cyan"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white/70">
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="min-h-12 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-cyan"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-white/70">
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={7}
                className="resize-none rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-cyan"
                placeholder="Tell me what you want to build..."
              />
            </label>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-h-6 text-sm text-white/52" role="status" aria-live="polite">
                {status}
              </p>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-violet/50 bg-violet px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:border-cyan/70 hover:bg-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                Send Message
                <Send size={16} aria-hidden="true" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
