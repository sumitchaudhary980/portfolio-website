"use client";

import { GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import SectionReveal from "@/components/SectionReveal";
import { education } from "@/data/site";

export default function Education() {
  const [activeSchool, setActiveSchool] = useState(education[0]?.school || "");

  return (
    <section id="education" className="section-shell" aria-labelledby="education-title">
      <div className="container-shell">
        <SectionReveal>
          <SectionHeading id="education-title" eyebrow="Education" title="A foundation in engineering and computer science." align="center" />
        </SectionReveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6">
          {education.map((item, index) => {
            const isActive = activeSchool === item.school;
            return (
              <SectionReveal key={item.school} delay={index * 0.08} className="relative pl-9">
                <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-violet via-cyan to-transparent" />
                <div className={`absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full border bg-ink transition ${isActive ? "border-cyan text-cyan shadow-cyan" : "border-violet/50 text-violet"}`}>
                  <GraduationCap size={16} aria-hidden="true" />
                </div>
                <article className="glass rounded-[8px] p-6 transition hover:border-cyan/40 md:p-8">
                  <button
                    type="button"
                    onClick={() => setActiveSchool(isActive ? "" : item.school)}
                    className="block w-full text-left focus:outline-none focus-visible:rounded-[8px] focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-expanded={isActive}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{item.school}</h3>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/54">
                          <MapPin size={15} aria-hidden="true" />
                          {item.location}
                        </p>
                      </div>
                      <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/62">
                        {item.period}
                      </p>
                    </div>
                    <p className="mt-6 text-lg font-semibold text-cyan">{item.degree}</p>
                  </button>
                  {isActive ? <p className="mt-3 text-base leading-7 text-white/62">{item.detail}</p> : null}
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
