import {
  Code2,
  Database,
  Figma,
  FileDown,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Server,
  TerminalSquare,
  Wrench
} from "lucide-react";
import {
  SiBootstrap,
  SiCss,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiVite,
  SiVscodium
} from "react-icons/si";

export const siteConfig = {
  name: "Sumit Kumar Chaudhary",
  title: "Full Stack Developer",
  tagline: "Building scalable web applications with modern technologies, intuitive user experiences, and clean architecture.",
  description:
    "Portfolio of Sumit Kumar Chaudhary, a Full Stack Developer building modern, scalable, and user-friendly web applications with clean code and reliable backend architecture.",
  url: "https://sumitkchaudhary.com",
  email: "sumit@example.com",
  location: "Kathmandu, Nepal",
  resume: "/sumit-kumar-chaudhary-resume.pdf",
  keywords: [
    "Sumit Kumar Chaudhary",
    "Full Stack Developer",
    "Next.js developer",
    "React developer",
    "Laravel developer",
    "Node.js developer",
    "Portfolio",
    "Kathmandu developer"
  ],
  socials: {
    github: "https://github.com/sumitkchaudhary",
    linkedin: "https://www.linkedin.com/in/sumitkchaudhary",
    instagram: "https://www.instagram.com/sumitkchaudhary"
  }
};

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" }
];

export const socialLinks = [
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "GitHub", href: siteConfig.socials.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: Linkedin },
  { label: "Instagram", href: siteConfig.socials.instagram, icon: Instagram },
  { label: "Resume", href: siteConfig.resume, icon: FileDown, download: true }
];

export const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "React", icon: SiReact },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Bootstrap", icon: SiBootstrap }
    ]
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "Laravel", icon: SiLaravel }
    ]
  },
  {
    title: "Database",
    icon: Database,
    skills: [
      { name: "MySQL", icon: SiMysql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "SQLite", icon: SiSqlite }
    ]
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "VS Code", icon: SiVscodium },
      { name: "Postman", icon: SiPostman },
      { name: "Figma", icon: SiFigma },
      { name: "Vite", icon: SiVite }
    ]
  }
];

export const experience = [
  {
    company: "Immersive Mobile Designs",
    role: "Full Stack Developer Intern",
    period: "December 2024 - April 2025",
    icon: TerminalSquare,
    responsibilities: [
      "Developed a robust multi-vendor e-commerce marketplace using Laravel.",
      "Built scalable backend architecture.",
      "Implemented vendor registration and management.",
      "Developed shopping cart with guest checkout.",
      "Integrated secure payment gateways.",
      "Automated monthly vendor payouts.",
      "Applied comprehensive validation rules.",
      "Focused on scalability and maintainability."
    ]
  }
];

export const projects = [
  {
    title: "Kaiser Library",
    slug: "kaiser-library",
    image: "/projects/kaiser-library.png",
    alt: "Placeholder interface preview for Kaiser Library showing a refined digital library dashboard",
    description:
      "A polished library management concept focused on searchable collections, clean resource discovery, and fast administrative workflows.",
    tech: ["React", "Laravel", "MySQL", "Tailwind CSS"],
    github: "https://github.com/sumitkchaudhary/kaiser-library",
    demo: "#contact"
  },
  {
    title: "CineBook",
    slug: "cinebook",
    image: "/projects/cinebook.png",
    alt: "Placeholder interface preview for CineBook showing a cinematic booking experience",
    description:
      "A movie booking experience designed around intuitive showtime discovery, seat selection, and a responsive checkout flow.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/sumitkchaudhary/cinebook",
    demo: "#contact"
  },
  {
    title: "ResumeAI",
    slug: "resumeai",
    image: "/projects/resumeai.png",
    alt: "Placeholder interface preview for ResumeAI showing resume analysis and scoring panels",
    description:
      "An AI-assisted resume improvement tool concept for parsing resumes, surfacing gaps, and suggesting clearer role-focused copy.",
    tech: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    github: "https://github.com/sumitkchaudhary/resumeai",
    demo: "#contact"
  }
];

// Replace the project placeholder PNGs in public/projects with real product screenshots when they are ready.
export const projectFilters = ["All", "React", "Laravel", "Node.js", "MySQL", "MongoDB", "Next.js"];

export const education = [
  {
    school: "RK University",
    location: "Rajkot, India",
    degree: "Diploma in Computer Engineering",
    period: "July 2022 - April 2025",
    detail: "Grade A"
  },
  {
    school: "Herald College",
    location: "Naxal, Kathmandu",
    degree: "BSc (Hons) in Computer Science",
    period: "2025 - Present",
    detail: "Affiliated with University of Wolverhampton, UK. Pursuing."
  }
];

export const contactMethods = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "GitHub", value: "github.com/sumitkchaudhary", href: siteConfig.socials.github, icon: Github },
  { label: "LinkedIn", value: "linkedin.com/in/sumitkchaudhary", href: siteConfig.socials.linkedin, icon: Linkedin },
  { label: "Instagram", value: "instagram.com/sumitkchaudhary", href: siteConfig.socials.instagram, icon: Instagram },
  { label: "Figma", value: "Design-minded engineering", href: "#projects", icon: Figma }
];
