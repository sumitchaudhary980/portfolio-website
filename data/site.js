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
  SiPhp,
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
  tagline: "Full Stack Developer based in Kathmandu, Nepal, building modern, scalable, and user-friendly web applications with React, HTML5, CSS3, Bootstrap, JavaScript, PHP, Laravel, and Node.js", description:
    "Sumit Kumar Chaudhary is a Full Stack Developer based in Kathmandu, Nepal. Explore my portfolio featuring React, HTML5, CSS3, Bootstrap, Javascript, PHP, Laravel, Node.js, and modern web application projects with scalable backend architecture and responsive user interfaces.",
  url: "https://www.sumitkumarchaudhary.com.np",
  email: "jaiswalsumit1010@gmail.com",
  location: "Kathmandu, Nepal",
  resume: "/sumit-kumar-chaudhary.pdf",
  keywords: [
    "Sumit Kumar Chaudhary",
    "Sumit Chaudhary",
    "Full Stack Developer Kathmandu",
    "Full Stack Developer Nepal",
    "Web Developer Kathmandu",
    "React Developer Kathmandu",
    "Node.js Developer Kathmandu",
    "Laravel Developer Nepal",
    "JavaScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Developer Nepal",
    "Portfolio",
    "React Portfolio",
    "Kathmandu",
    "Nepal"
  ],
  socials: {
    github: "https://github.com/sumitchaudhary980",
    linkedin: "https://www.linkedin.com/in/sumit-kumar-chaudhary-505129320/",
    instagram: "https://www.instagram.com/sumitjaiswal.1"
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
      { name: "PHP", icon: SiPhp },
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
      { name: "Figma", icon: SiFigma }
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
    alt: "Kaiser Library Management System admin dashboard for managing books, authors, and genres",
    description:
      "A full-stack library management system featuring secure admin authentication, book, author, and genre management, Cloudinary-powered image uploads, search, pagination, and a responsive administrative dashboard.",
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express.js",
      "SQLite",
      "Cloudinary"
    ],
    github: "https://github.com/sumitchaudhary980/library-management-system",
    demo: "https://library-management-system-tvi5.onrender.com/"
  },
  {
    title: "Buyzon",
    slug: "multi-vendor-ecommerce",
    image: "/projects/buyzon.png",
    alt: "Multi-vendor e-commerce platform with vendor dashboard, product management, and order processing",
    description:
      "A full-stack multi-vendor e-commerce platform built with Laravel and React, featuring vendor dashboards, product variations, order management, Stripe payment integration, authentication, and background job processing.",
    tech: [
      "Laravel",
      "React",
      "PHP",
      "MySQL",
      "Stripe",
      "JavaScript"
    ],
    github: "https://github.com/sumitchaudhary980/laravel-react-multi-vendor-ecommerce",
    demo: "#"
  },
  {
    title: "ChatVibe",
    slug: "chat-vibe",
    image: "/projects/chat-vibe.png",
    alt: "Real-time chat application with instant messaging, user authentication, and media sharing",
    description:
      "A full-stack real-time chat application built with React, Node.js, Express, and MongoDB. Features secure authentication, instant messaging with Socket.IO, Cloudinary-powered image sharing, and a responsive user interface.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "Cloudinary"
    ],
    github: "https://github.com/sumitchaudhary980/fullstack-chat-app",
    demo: "https://fullstack-chat-app-k0kb.onrender.com/"
  },
  {
    title: "DesignAura",
    slug: "designaura",
    image: "/projects/designaura.png",
    alt: "DesignAura e-commerce website for browsing and ordering custom mobile covers",
    description:
      "A Laravel-based e-commerce platform for custom mobile covers featuring product browsing, shopping cart, secure Razorpay payment integration, order management, and a responsive user experience.",
    tech: [
      "Laravel",
      "PHP",
      "MySQL",
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "Razorpay"
    ],
    github: "https://github.com/sumitchaudhary980/mobile-cover-website",
    demo: "https://designaura.lovestoblog.com/"
  },
  {
    title: "ThinkBoard",
    slug: "thinkboard",
    image: "/projects/thinkboard.png",
    alt: "ThinkBoard MERN note-taking application with a responsive dashboard for creating and managing notes",
    description:
      "A full-stack MERN note-taking application that allows users to create, edit, and delete notes through a responsive interface, with RESTful APIs, MongoDB storage, and Upstash Redis-powered rate limiting.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "Upstash Redis"
    ],
    github: "https://github.com/sumitchaudhary980/mern-notes-website",
    demo: "https://thinkboard-mx6j.onrender.com/"
  },

];

// Replace the project placeholder PNGs in public/projects with real product screenshots when they are ready.
export const projectFilters = ["All", "React", "Laravel", "Node.js", "MySQL", "SQLite", "MongoDB"];

export const education = [
  {
    school: "Herald College",
    location: "Naxal, Kathmandu",
    degree: "BSc (Hons) in Computer Science",
    period: "2025 - Present",
    detail: "Affiliated with University of Wolverhampton, UK. Pursuing."
  },

  {
    school: "RK University",
    location: "Rajkot, India",
    degree: "Diploma in Computer Engineering",
    period: "July 2022 - April 2025",
    detail: "Grade A"
  },

  {
    school: "Shree Janta Secondary School",
    location: "Lahan-10, Nepal",
    degree: "SEE",
    period: "2013-2022",
    detail: "GPA: 3.40"
  }
];

export const contactMethods = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "GitHub", value: "github.com/sumitchaudhary980", href: siteConfig.socials.github, icon: Github },
  { label: "LinkedIn", value: "https://www.linkedin.com/in/sumit-chaudhary-505129320/", href: siteConfig.socials.linkedin, icon: Linkedin },
  { label: "Instagram", value: "instagram.com/sumitjaiswal.1", href: siteConfig.socials.instagram, icon: Instagram },
];
