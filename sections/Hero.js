import { ArrowDown, ArrowRight, FileDown, Mail, MapPin } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { siteConfig } from "@/data/site";

export default function Hero() {
  return (
    <section id="home" className="hero-section" aria-labelledby="hero-title">
      <div className="container-shell hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">Hi, I&apos;m</p>
          <h1 id="hero-title">Sumit Kumar<br /><span>Chaudhary</span></h1>
          <p className="hero-role">{siteConfig.title}</p>
          <p className="hero-location"><MapPin size={15} aria-hidden="true" />{siteConfig.location}</p>
          <p className="hero-description">{siteConfig.tagline}</p>
          <div className="hero-actions">
            <MagneticButton href="#projects">View Projects <ArrowRight size={17} aria-hidden="true" /></MagneticButton>
            <MagneticButton href="#contact" variant="secondary">Contact Me <Mail size={17} aria-hidden="true" /></MagneticButton>
            <MagneticButton href={siteConfig.resume} download variant="secondary">Download Resume <FileDown size={17} aria-hidden="true" /></MagneticButton>
          </div>
        </div>
        <div id="hero-world-anchor" className="hero-world" aria-hidden="true">
          <div className="world-fallback"><span /><span /><span /></div>
          <span className="world-coordinate">01 / INTRODUCTION</span>
          <span className="world-caption">Interfaces. Systems. Everything in between.</span>
        </div>
      </div>
      <div className="container-shell hero-footnote">
        <span>React <i /> Laravel <i /> JavaScript <i /> PHP</span>
        <a href="#about">Explore the portfolio <ArrowDown size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
