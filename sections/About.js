import Image from "next/image";
import { Layers3, Rocket, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import SectionReveal from "@/components/SectionReveal";

const principles = [
  {
    title: "Scalable Systems",
    copy: "Backend architecture that stays understandable as products grow.",
    icon: ShieldCheck
  },
  {
    title: "Responsive Interfaces",
    copy: "Frontend experiences that feel crisp, accessible, and intentional.",
    icon: Layers3
  },
  {
    title: "Product Momentum",
    copy: "Clean implementation choices that help ideas become reliable products.",
    icon: Rocket
  }
];

export default function About() {
  return (
    <section id="about" className="section-shell overflow-hidden" aria-labelledby="about-title">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <SectionReveal>
          <SectionHeading id="about-title" eyebrow="About Me" title="Full Stack Developer in Kathmandu" />
          <p className="mt-7 text-lg leading-8 text-white/68">
            I'm Sumit Kumar Chaudhary, a Full Stack Developer based in Kathmandu, Nepal,
            passionate about building modern, scalable, and user-friendly web
            applications. I enjoy working across the entire development stack using
            React, Next.js, Node.js, Laravel, MySQL, and MongoDB to create responsive
            interfaces and reliable backend systems. I'm always learning new technologies
            and enjoy solving real-world problems through clean, maintainable, and
            efficient code.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass rounded-[8px] p-5">
                  <Icon className="mb-4 text-cyan" size={24} aria-hidden="true" />
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/56">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.08} className="relative">
          <div className="absolute left-0 top-10 h-px w-40 bg-gradient-to-r from-cyan/40 to-transparent" aria-hidden="true" />
          <div className="absolute bottom-8 right-0 h-px w-36 bg-gradient-to-l from-violet/40 to-transparent" aria-hidden="true" />
          <div className="glass relative overflow-hidden rounded-[8px] p-4">
            <Image
              src="/image/profile1.jpg"
              alt="Profile Image"
              width={900}
              height={720}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[5/4] w-full rounded-[6px] object-cover"
              priority={false}
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
