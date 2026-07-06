import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Education from "@/sections/Education";
import Experience from "@/sections/Experience";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SocialDock from "@/components/SocialDock";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: `${siteConfig.name} - Full Stack Developer Portfolio`,
  description:
    "Explore the full stack development portfolio of Sumit Kumar Chaudhary, including scalable web applications, Laravel marketplaces, React interfaces, and modern backend systems.",
  keywords: [
    ...siteConfig.keywords,
    "Full stack portfolio",
    "Web application developer",
    "Frontend developer",
    "Backend developer"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${siteConfig.name} - Full Stack Developer Portfolio`,
    description:
      "Modern portfolio showcasing scalable web applications, clean architecture, and thoughtful user experiences by Sumit Kumar Chaudhary.",
    url: siteConfig.url,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio preview`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Full Stack Developer Portfolio`,
    description:
      "Full Stack Developer building scalable web applications with modern technologies and polished user experiences.",
    images: ["/opengraph-image"]
  }
};

export default function HomePage() {
  return (
    <>
      <Header />
      <SocialDock />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
