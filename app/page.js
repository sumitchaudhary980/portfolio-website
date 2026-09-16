import About from "@/sections/About";
import Certificates from "@/sections/Certificates";
import Contact from "@/sections/Contact";
import Education from "@/sections/Education";
import Experience from "@/sections/Experience";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import CustomCursor from "@/components/CustomCursor";
import DeveloperTerminal from "@/components/DeveloperTerminal";
import Footer from "@/components/Footer";
import GitHubActivity from "@/components/GitHubActivity";
import Header from "@/components/Header";
import PortfolioAssistant from "@/components/PortfolioAssistant";
import PortfolioWorld from "@/components/PortfolioWorld";
import SocialDock from "@/components/SocialDock";
import VSCodeLiveSection from "@/components/VSCodeLiveSection";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: { absolute: `${siteConfig.name} | Full Stack Developer` },
  description: siteConfig.description,

  verification: {
    google: "76tGA8Fr2ZSJ_2GDg5bD7sT26lmnZGZuObp1z3ChezQ",
  },

  keywords: [
    ...siteConfig.keywords,
    "Full stack portfolio",
    "Web application developer",
    "Frontend developer",
    "Backend developer",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: `${siteConfig.name} | Full Stack Developer`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio preview`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Full Stack Developer`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return (
    <>
      <PortfolioWorld />
      <Header />
      <SocialDock />
      <main id="main-content">
        <Hero />
        <DeveloperTerminal />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <GitHubActivity />
        <VSCodeLiveSection />
        <Education />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <PortfolioAssistant />
      <CustomCursor />
    </>
  );
}
