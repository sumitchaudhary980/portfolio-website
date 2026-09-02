"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { projects, skillCategories } from "@/data/site";
import { staggerContainer, viewportOnce } from "@/utils/motion";

export default function Skills() {
  const shouldReduceMotion = useReducedMotion();
  const skillAliases = {
    HTML5: ["HTML", "HTML5"],
    CSS3: ["CSS", "CSS3"],
    React: ["React", "React.js"],
    JavaScript: ["JavaScript", "Javascript"]
  };
  const projectMatches = (skillName) => {
    const names = skillAliases[skillName] || [skillName];
    return projects
      .filter((project) => project.tech.some((tech) => names.some((name) => tech.toLowerCase() === name.toLowerCase())))
      .map((project) => project.title);
  };

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
                    const matches = projectMatches(skill.name);
                    return (
                      <motion.div
                        key={skill.name}
                        className="group relative grid min-h-28 place-items-center rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-center transition hover:border-cyan/50 hover:bg-cyan/10 hover:shadow-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
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
                        aria-label={`${skill.name}${matches.length ? `, used in ${matches.join(", ")}` : ""}`}
                      >
                        <SkillIcon className="text-4xl text-white/84 transition group-hover:text-cyan" aria-hidden="true" />
                        <span className="mt-3 text-xs font-semibold text-white/58">{skill.name}</span>
                        <span className="pointer-events-none absolute -top-12 z-10 max-w-56 rounded-[8px] border border-white/10 bg-ink/95 px-3 py-2 text-xs font-semibold leading-5 text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus:opacity-100">
                          {matches.length ? `Used in ${matches.slice(0, 3).join(", ")}` : `${skill.name} in the stack`}
                        </span>
                        <span className="absolute bottom-2 h-1 w-8 rounded-full bg-cyan/0 transition group-hover:bg-cyan/70 group-focus:bg-cyan/70" aria-hidden="true" />
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
