"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Award, Expand, ExternalLink, X } from "lucide-react";
import ProjectDialog from "@/components/ProjectDialog";
import SectionHeading from "@/components/SectionHeading";
import SectionReveal from "@/components/SectionReveal";
import { certificates } from "@/data/certificates";

export default function Certificates() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="certificates" className="section-shell" aria-labelledby="certificates-title">
      <div className="container-shell">
        <SectionReveal className="certificates-heading">
          <SectionHeading id="certificates-title" eyebrow="Certificates" title="Always learning. Always building.">
            A collection of courses and hands-on learning across development, design, and the web.
          </SectionHeading>
          <div className="certificates-count">
            <Award size={24} aria-hidden="true" />
            <span><strong>{String(certificates.length).padStart(2, "0")}</strong> certificates earned</span>
          </div>
        </SectionReveal>

        <div className="certificates-grid">
          {certificates.map((certificate, index) => (
            <SectionReveal as="article" key={certificate.slug} className="certificate-card" delay={(index % 3) * 0.06}>
              <button type="button" className="certificate-preview" aria-label={`View ${certificate.title} certificate`} aria-haspopup="dialog" onClick={() => setSelected(certificate)}>
                <Image src={certificate.image} alt={`${certificate.title} certificate awarded to Sumit Kumar Chaudhary by ${certificate.issuer}`} fill sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 90vw" />
                <span className="certificate-expand"><Expand size={16} aria-hidden="true" /><span>View certificate</span></span>
              </button>
              <div className="certificate-details">
                <div className="certificate-meta"><span>{certificate.category}</span><time dateTime={certificate.date}>{certificate.dateLabel}</time></div>
                <h3>{certificate.title}</h3>
                <div className="certificate-footer">
                  <p><Award size={16} aria-hidden="true" />{certificate.issuer}</p>
                  <button type="button" onClick={() => setSelected(certificate)} aria-label={`Open ${certificate.title} certificate`} aria-haspopup="dialog"><ArrowUpRight size={21} aria-hidden="true" /></button>
                </div>
                <a className="certificate-verify" href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${certificate.title} certificate (opens in a new tab)`}>Verify certificate<ExternalLink size={15} aria-hidden="true" /></a>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {selected && (
        <ProjectDialog label={`${selected.title} certificate`} className="certificate-dialog" onClose={() => setSelected(null)}>
          <article>
            <div className="certificate-dialog-heading">
              <div><p className="eyebrow">Certificate of completion</p><h3>{selected.title}</h3><p className="certificate-dialog-meta">{selected.issuer} · {selected.dateLabel}</p></div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close certificate"><X size={22} aria-hidden="true" /></button>
            </div>
            <div className="certificate-full-image">
              <Image src={selected.image} alt={`${selected.title} certificate awarded to Sumit Kumar Chaudhary`} fill sizes="(min-width: 1100px) 1000px, 95vw" quality={90} />
            </div>
            <div className="certificate-dialog-footer">
              <div className="certificate-dialog-links">
                <a href={selected.verificationUrl} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${selected.title} certificate (opens in a new tab)`}>Verify certificate<ExternalLink size={16} aria-hidden="true" /></a>
                <a href={encodeURI(selected.image)} target="_blank" rel="noreferrer">Open original image<ExternalLink size={16} aria-hidden="true" /></a>
              </div>
              <span>Esc to close</span>
            </div>
          </article>
        </ProjectDialog>
      )}
    </section>
  );
}
