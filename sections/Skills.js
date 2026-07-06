"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { skillCategories } from "@/data/site";
import { staggerContainer, viewportOnce } from "@/utils/motion";

export default function Skills() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="skills" className="section-shell" aria-labelledby="skills-title">
      <div className="container-shell">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
        >
          <SectionHeading id="skills-title" eyebrow="Skills & Technologies" title="A practical stack for modern web products." align="center">
            Tools I use to build responsive interfaces, reliable APIs, structured data flows, and maintainable product
            foundations.
          </SectionHeading>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-5 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce()}
          variants={staggerContainer}
        >
          {skillCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <motion.article
                key={category.title}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
                }}
                className="glass rounded-[8px] p-5"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-cyan/20 bg-cyan/10 text-cyan">
                    <CategoryIcon size={21} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {category.skills.map((skill, index) => {
                    const SkillIcon = skill.icon;
                    return (
                      <motion.div
                        key={skill.name}
                        className="group relative grid min-h-28 place-items-center rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-center transition hover:border-cyan/50 hover:bg-cyan/10 hover:shadow-cyan"
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : {
                                y: [0, -4, 0]
                              }
                        }
                        transition={{ duration: 4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                        tabIndex={0}
                        aria-label={skill.name}
                      >
                        <SkillIcon className="text-4xl text-white/84 transition group-hover:text-cyan" aria-hidden="true" />
                        <span className="mt-3 text-xs font-semibold text-white/58">{skill.name}</span>
                        <span className="pointer-events-none absolute -top-9 rounded-full border border-white/10 bg-ink/95 px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus:opacity-100">
                          {skill.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
