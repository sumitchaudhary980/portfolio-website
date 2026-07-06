"use client";

import Image from "next/image";
import { ExternalLink, Github, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import SectionHeading from "@/components/SectionHeading";
import { projectFilters, projects } from "@/data/site";
import { staggerContainer, viewportOnce } from "@/utils/motion";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((project) => project.tech.includes(filter));
  }, [filter]);

  return (
    <section id="projects" className="section-shell overflow-hidden" aria-labelledby="projects-title">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce()}
          >
            <SectionHeading id="projects-title" eyebrow="Featured Projects" title="Product stories with room to grow." />
          </motion.div>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce()}
            className="flex flex-wrap items-center gap-2 lg:justify-end"
            aria-label="Project technology filters"
          >
            <span className="mr-2 hidden items-center gap-2 text-sm font-semibold text-white/52 sm:inline-flex">
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filter
            </span>
            {projectFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                  filter === item
                    ? "border-cyan/70 bg-cyan text-ink"
                    : "border-white/10 bg-white/[0.04] text-white/62 hover:border-cyan/50 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce()}
          variants={staggerContainer}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                key={project.slug}
                layout
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } }
                }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                whileHover={shouldReduceMotion ? undefined : { y: -8 }}
                className="group glass relative overflow-hidden rounded-[8px] p-3"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-violet to-transparent" />
                </div>
                <div className="overflow-hidden rounded-[6px] border border-white/10 bg-white/[0.03]">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    width={980}
                    height={720}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-3 min-h-24 text-sm leading-7 text-white/62">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <MagneticButton
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      variant="secondary"
                      className="min-h-11 px-4 py-2"
                    >
                      <Github size={16} aria-hidden="true" />
                      GitHub
                    </MagneticButton>
                    <MagneticButton href={project.demo} variant="primary" className="min-h-11 px-4 py-2">
                      <ExternalLink size={16} aria-hidden="true" />
                      Live Demo
                    </MagneticButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
