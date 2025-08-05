import emoji from "react-easy-emoji";
import {
  EducationType,
  ExperienceType,
  FeedbackType,
  ProjectType,
  SkillsSectionType,
  SkillBarsType,
  SEODataType,
  SocialLinksType,
  GreetingsType,
} from "./types/sections";

export const greetings: GreetingsType = {
  name: "Sumit Chaudhary",
  title: "Hi all, I'm Sumit",
  description:
    "I'm a passionate Full Stack Web Developer with experience building dynamic web applications using HTML, CSS, JavaScript, Bootstrap, React, PHP, and Laravel, along with integrating various payment systems. I have a strong interest in exploring new technologies and applying them to enhance my projects. I'm a self-motivated and hardworking individual, always eager to learn, adapt, and collaborate effectively in a team environment.",
  resumeLink: "#",
};

export const openSource = {
  githubUserName: "sumitchaudhary980",
};

export const contact = {};

export const socialLinks: SocialLinksType = {
  email: ":sc.sumit.chaudhary.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/sumit-chaudhary-505129320/",
  github: "https://github.com/sumitchaudhary980",
};

export const skillsSection: SkillsSectionType = {
  title: "What I do",
  subTitle: "CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  data: [
    {
      title: "Full Stack Development",
      lottieAnimationFile: "/lottie/skills/fullstack.json", // Path of Lottie Animation JSON File
      skills: [
        emoji("⚡ Building responsive Single-Page-Apps (SPA) & PWAs using React.js"),
        emoji("⚡ Developing responsive static websites using HTML, CSS, JavaScript, and Bootstrap"),
        emoji("⚡ Creating RESTful APIs and backend solutions with PHP & Laravel"),
        emoji("⚡ Integrating secure payment gateways into web applications"),
      ],
     softwareSkills: [
  {
    skillName: "HTML5",
    iconifyTag: "vscode-icons:file-type-html",
  },
  {
    skillName: "CSS3",
    iconifyTag: "vscode-icons:file-type-css",
  },
  {
    skillName: "JavaScript",
    iconifyTag: "logos:javascript",
  },
  {
    skillName: "Bootstrap",
    iconifyTag: "logos:bootstrap",
  },
  {
    skillName: "React",
    iconifyTag: "vscode-icons:file-type-reactjs",
  },
  {
    skillName: "PHP",
    iconifyTag: "logos:php",
  },
  {
    skillName: "Laravel",
    iconifyTag: "logos:laravel",
  },
  {
    skillName: "Payment Integration",
    iconifyTag: "mdi:credit-card-outline", // you might need to pick an icon library that supports this
  },
  {
    skillName: "GitHub",
    iconifyTag: "akar-icons:github-fill",
  },
],

    },
  ],
};



export const educationInfo: EducationType[] = [
  {
    schoolName: "RK University, Rajkot, India",
    subHeader: "Diploma in Computer Engineering",
    duration: "July 2022 - April 2025",
    desc: "",
    grade: "Grade A",
    descBullets: [],
  },
  {
    schoolName: "Herald College, Naxal, Kathmandu",
    subHeader: "BSc (Hons) in Computer Science (Affiliated with University of Wolverhampton, UK) (Pursuing)",
    duration: "2025 - Present",
    desc: "Currently attending UPC classes; main semester starts from September 2025.",
    grade: "",
    descBullets: [
      "Admitted recently, preparing for main coursework beginning September 2025.",
      "Following curriculum affiliated with University of Wolverhampton, UK.",
    ],
  },
];


export const experience: ExperienceType[] = [
  // ... your other experiences
  {
    role: "Full Stack Developer (Intern)",
    company: "Immersive Mobile Designs",
    companyLogo: "/img/icons/common/iMobiledesigns.jpeg", // add appropriate logo path if you have
    date: "Dec 2024 -Apr 2025", // adjust dates if different
    desc: "Developed a robust multi-vendor e-commerce marketplace project using Laravel for backend and React for frontend. Focused on creating a seamless user experience, secure payment integration, and efficient vendor management.",
    descBullets: [
      "Implemented multi-vendor functionality allowing multiple sellers to register and manage products.",
      "Developed smooth shopping cart features with guest user support.",
      "Integrated secure payment gateways for checkout and automated vendor payouts.",
      "Utilized Daisy UI components to design responsive and user-friendly interfaces.",
      "Applied comprehensive validation rules to forms and categories to ensure data integrity.",
      "Architected the project focusing on scalability and maintainability.",
      "Automated monthly vendor payouts to streamline financial processes.",
    ],
  },
];


export const projects: ProjectType[] = [
  {
    name: "Coffee Shop Website",
    desc: "A simple coffee shop website built using HTML, CSS, JavaScript, and JQuery to provide an engaging front-end user experience.",
    link: "https://kathmanducoffeeshop.netlify.app",
  },
  {
    name: "Green Tea Website",
    desc: "A fully functional e-commerce website with Razorpay payment integration, product search, user profile updates, password reset via email, promotional offers, and an intuitive user experience, built using PHP.",
    github: "https://github.com/sumitchaudhary980/Green-Coffee",
    link: "https://greencoffee.great-site.net",
  },
  {
    name: "Mobile Cover Website",
    desc: "A Laravel-based e-commerce platform featuring Razorpay payment integration, automated order confirmation emails, product search, user profile updates, password reset via email, promotional offers, and a contact section.",
    github: "https://github.com/sumitchaudhary980/mobile-cover-website",
    link: "https://designaura.lovestoblog.com",
  },
  {
    name: "Multi-Vendor E-commerce Website",
    github: "https://github.com/sumitchaudhary980/laravel-react-multi-vendor-ecommerce",
    desc: "A robust multi-vendor e-commerce marketplace built using Laravel for the backend and React for the frontend, featuring secure payment integration, multi-vendor functionality, smooth shopping cart features with guest user support, automated vendor payouts, and responsive Daisy UI components for a user-friendly interface.",
  },
];



// See object prototype on /types/section.ts page
export const seoData: SEODataType = {
  title: "Sumit Chaudhary",
  description: greetings.description,
  author: "Sumit Chaudhary",
  image: "https://avatars.githubusercontent.com/u/?v=4",
  url: "https://developer-portfolio-1hanzla100.vercel.app",
  keywords: [
    "Sumit",
    "Sumit Chaudhary",
    "@sumitjaiswal.1",
    "sumitjaiswal.1",
    "Portfolio",
    "Sumit Portfolio ",
    "Sumit Chaudhary Portfolio",
  ],
};
