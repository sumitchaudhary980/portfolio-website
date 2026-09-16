"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import SectionReveal from "@/components/SectionReveal";
import { projects, skillCategories } from "@/data/site";

export default function Skills() {
  const [category, setCategory] = useState(0);
  const [selected, setSelected] = useState("React");
  const current = skillCategories[category];
  const aliases = { HTML5: "HTML", CSS3: "CSS" };
  const matches = projects.filter((project) => project.tech.includes(aliases[selected] || selected));
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portfolio:skills", { detail: { category, selected } }));
  }, [category, selected]);

  return (
    <section id="skills" className="section-shell" aria-labelledby="skills-title">
      <div className="container-shell">
        <SectionReveal><SectionHeading id="skills-title" eyebrow="Skills & Technologies" title="A practical stack. A connected system.">Tools I use to build responsive interfaces, reliable APIs, structured data flows, and maintainable product foundations.</SectionHeading></SectionReveal>
        <div className="skills-layout">
          <div className="skills-index">
            <div className="skill-categories" aria-label="Technology categories">
              {skillCategories.map((item, index) => {
                const Icon = item.icon;
                return <button key={item.title} type="button" aria-pressed={index === category} onClick={() => { setCategory(index); setSelected(item.skills[0].name); }}><Icon size={19} aria-hidden="true" /><span>{item.title}</span><span className="category-count">0{item.skills.length}</span></button>;
              })}
            </div>
            <div className="skill-detail" aria-live="polite" aria-atomic="true">
              <p className="eyebrow">In the stack</p><h3>{selected}</h3>
              {matches.length ? <><p>Explore it in my work:</p><ul>{matches.map((project) => <li key={project.slug}><a href={"#project-" + project.slug}>{project.title}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul></> : <p>Part of my {current.title.toLowerCase()} toolkit.</p>}
            </div>
          </div>
          <div className="skills-visual">
            <div id="skills-world-anchor" className="skills-orbit" aria-label={current.title + " technology orbit"}>
              <div className="world-fallback" aria-hidden="true"><span /><span /><span /></div>
              {current.skills.map((skill, index) => {
                const Icon = skill.icon;
                const angle = index / current.skills.length * Math.PI * 2;
                return <button key={skill.name} type="button" data-orbit-label={index} data-skill-name={skill.name} aria-pressed={selected === skill.name}
                  className="orbit-label" style={{ left: (Math.round((50 + Math.cos(angle) * 33) * 1000) / 1000) + "%", top: (Math.round((50 + Math.sin(angle) * 35) * 1000) / 1000) + "%" }}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") window.dispatchEvent(new CustomEvent("portfolio:hover", { detail: index })); }}
                  onPointerLeave={() => window.dispatchEvent(new CustomEvent("portfolio:hover", { detail: -1 }))}
                  onClick={() => setSelected(skill.name)} onFocus={() => setSelected(skill.name)}><Icon size={21} aria-hidden="true" /><span>{skill.name}</span></button>;
              })}
            </div>
            <p className="orbit-hint">Drag sideways to explore · Select a technology</p>
          </div>
        </div>
        <div className="skill-inventory" aria-label="Complete technology stack">{skillCategories.map((item) => <div key={item.title}><h3>{item.title}</h3><p>{item.skills.map((skill) => skill.name).join(" · ")}</p></div>)}</div>
      </div>
    </section>
  );
}
