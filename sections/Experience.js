import { CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import SectionReveal from "@/components/SectionReveal";
import { experience } from "@/data/site";

export default function Experience() {
  return (
    <section id="experience" className="section-shell" aria-labelledby="experience-title">
      <div className="container-shell">
        <SectionReveal>
          <SectionHeading id="experience-title" eyebrow="Experience" title="Building production-shaped systems early." />
        </SectionReveal>

        <div className="mt-14 grid gap-8">
          {experience.map((item) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.company} className="relative pl-8 md:pl-12">
                <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyan via-violet to-transparent md:left-5" />
                <div className="absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full border border-cyan/50 bg-ink text-cyan md:left-2">
                  <Icon size={15} aria-hidden="true" />
                </div>
                <article className="glass rounded-[8px] p-6 md:p-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{item.company}</h3>
                      <p className="mt-2 text-lg font-semibold text-cyan">{item.role}</p>
                    </div>
                    <p className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/62">
                      {item.period}
                    </p>
                  </div>
                  <ul className="mt-7 grid gap-3 md:grid-cols-2">
                    {item.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-3 text-sm leading-6 text-white/64">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-green" size={18} aria-hidden="true" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
