"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Send, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { contactMethods } from "@/data/site";
import { viewportOnce } from "@/utils/motion";

const initialState = {
  name: "",
  email: "",
  purpose: "project",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && !value.trim()) {
      error = "Full name is required.";
    }
    if (name === "email" && !value.includes("@")) {
      error = "Valid email is required.";
    }
    if (name === "message" && value.trim().length < 10) {
      error = "Must be 10+ characters.";
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formErrors = {};
    Object.keys(initialState).forEach((key) => {
      if (key !== "purpose") {
        const error = validateField(key, form[key]);
        if (error) formErrors[key] = error;
      }
    });

    setTouched({ name: true, email: true, message: true });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setStatus("");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/mpqgnkdn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setStatus("success");
        setForm(initialState);
        setTouched({});
        setShowToast(true);
        
        setTimeout(() => {
          setShowToast(false);
          setStatus("");
        }, 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
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
            <div className="grid gap-5 sm:grid-cols-2 pb-4">
              <label className="grid gap-2 text-sm font-semibold text-white/70 relative pb-4">
                Full Name
                <div className="relative flex items-center">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full min-h-12 rounded-[8px] border bg-white/[0.04] pl-4 text-white outline-none transition placeholder:text-white/28 ${
                      errors.name && touched.name ? "border-red-500/60 focus:border-red-500 pr-10" : "border-white/10 focus:border-cyan pr-4"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && touched.name && (
                    <AlertCircle className="absolute right-3 text-red-400" size={16} aria-hidden="true" />
                  )}
                </div>
                {errors.name && touched.name && (
                  <span className="absolute bottom-0 left-0 text-[10px] font-medium text-red-400">{errors.name}</span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-semibold text-white/70 relative pb-4">
                Email
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full min-h-12 rounded-[8px] border bg-white/[0.04] pl-4 text-white outline-none transition placeholder:text-white/28 ${
                      errors.email && touched.email ? "border-red-500/60 focus:border-red-500 pr-10" : "border-white/10 focus:border-cyan pr-4"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && touched.email && (
                    <AlertCircle className="absolute right-3 text-red-400" size={16} aria-hidden="true" />
                  )}
                </div>
                {errors.email && touched.email && (
                  <span className="absolute bottom-0 left-0 text-[10px] font-medium text-red-400">{errors.email}</span>
                )}
              </label>
            </div>

            <label className="mt-1 grid gap-2 text-sm font-semibold text-white/70">
              Reason for Contact
              <div className="relative">
                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full min-h-12 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-cyan appearance-none cursor-pointer pr-10 [&>option]:bg-[#12141c] [&>option]:text-white"
                >
                  <option value="project">Project Discovery</option>
                  <option value="collaboration">Project Collaboration</option>
                  <option value="hire">Hiring Opportunity</option>
                  <option value="freelance">Freelance / Contract</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </label>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-white/70 relative pb-4">
              Message
              <div className="relative">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  rows={4}
                  className={`w-full resize-none rounded-[8px] border bg-white/[0.04] pt-3 pb-3 pl-4 text-white outline-none transition placeholder:text-white/28 ${
                    errors.message && touched.message ? "border-red-500/60 focus:border-red-500 pr-10" : "border-white/10 focus:border-cyan pr-4"
                  }`}
                  placeholder="Tell me what you want to build..."
                />
                {errors.message && touched.message && (
                  <AlertCircle className="absolute right-3 top-3.5 text-red-400" size={16} aria-hidden="true" />
                )}
              </div>
              {errors.message && touched.message && (
                <span className="absolute bottom-0 left-0 text-[10px] font-medium text-red-400">{errors.message}</span>
              )}
            </label>

            <div className="mt-6 flex flex-col items-center justify-end gap-4 sm:flex-row">
              {status === "error" && (
                <p className="text-sm text-red-400/90 font-medium sm:mr-2" role="status" aria-live="polite">
                  Oops! Something went wrong. Please try again.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-12 w-full sm:w-auto min-w-[150px] items-center justify-center gap-2 rounded-full border border-violet/50 bg-violet px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:border-cyan/70 hover:bg-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan whitespace-nowrap disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    Send Message
                    <Send size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 54, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 right-6 z-[99999] flex items-center gap-3 rounded-[12px] border border-emerald-500/30 bg-[#12141c] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] max-w-md w-[calc(100vw-3rem)] pointer-events-auto"
            role="alert"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Message sent successfully!</h4>
              <p className="mt-0.5 text-xs text-white/60">Thank you for reaching out. I will get back to you within 24 hours.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}