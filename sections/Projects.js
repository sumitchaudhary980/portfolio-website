"use client";

import Image from "next/image";
import { ExternalLink, Github, Info, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import SectionHeading from "@/components/SectionHeading";
import { projectFilters, projects } from "@/data/site";
import { staggerContainer, viewportOnce } from "@/utils/motion";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
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

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="contents"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.slug}
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -8, rotateX: 1.4, rotateY: -1.4 }}
                  className="group glass relative overflow-hidden rounded-[8px] p-3"
                  data-cursor="VIEW"
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
                        <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/60 transition group-hover:border-cyan/30 group-hover:text-white/78">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:border-cyan/60 hover:bg-cyan/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                      >
                        <Info size={16} aria-hidden="true" />
                        Details
                      </button>
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
                      {project.demo !== "#" ? (
                        <MagneticButton
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          variant="primary"
                          className="min-h-11 px-4 py-2"
                        >
                          <ExternalLink size={16} aria-hidden="true" />
                          Live Demo
                        </MagneticButton>
                      ) : (
                        <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white/36">
                          Demo pending
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/78 p-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} project details`}
            onClick={() => setSelectedProject(null)}
          >
            <motion.article
              className="glass max-h-[88vh] w-full max-w-3xl overflow-auto rounded-[8px] p-5 md:p-7"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-white">{selectedProject.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{selectedProject.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  aria-label="Close project details"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedProject.tech.map((tech) => (
                  <span key={tech} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-semibold text-white/70">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton href={selectedProject.github} target="_blank" rel="noreferrer" variant="secondary" className="min-h-11 px-4 py-2">
                  <Github size={16} aria-hidden="true" />
                  GitHub
                </MagneticButton>
                {selectedProject.demo !== "#" ? (
                  <MagneticButton href={selectedProject.demo} target="_blank" rel="noreferrer" className="min-h-11 px-4 py-2">
                    <ExternalLink size={16} aria-hidden="true" />
                    Live Demo
                  </MagneticButton>
                ) : null}
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
