"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Terminal } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { contactMethods, education, experience, projects, skillCategories, siteConfig, socialLinks } from "@/data/site";
import { viewportOnce } from "@/utils/motion";

const prompt = "sumit@portfolio:~";
const commandAliases = {
  cls: "clear",
  mail: "email",
  "open email": "email",
  "open linkedin": "linkedin",
  "open github": "open github",
  insta: "instagram",
  "open instagram": "instagram",
  "open insta": "instagram",
  cv: "resume",
  "open resume": "resume"
};
const commandList = [
  "help",
  "clear",
  "cls",
  "about",
  "whoami",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
  "socials",
  "github",
  "open github",
  "linkedin",
  "open linkedin",
  "instagram",
  "insta",
  "open instagram",
  "open insta",
  "email",
  "mail",
  "open email",
  "resume",
  "cv",
  "open resume",
  "status"
];

function flattenSkills() {
  return skillCategories.map((category) => ({
    title: category.title,
    skills: category.skills.map((skill) => skill.name)
  }));
}

export default function DeveloperTerminal() {
  const shouldReduceMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [githubStatus, setGithubStatus] = useState("loading");
  const [history, setHistory] = useState([
    {
      type: "output",
      lines: [
        "Welcome to Sumit's developer terminal.",
        "Type `help` to explore projects, skills, links, and contact shortcuts."
      ]
    }
  ]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const skillGroups = useMemo(() => flattenSkills(), []);
  const skillCount = useMemo(() => skillGroups.reduce((total, group) => total + group.skills.length, 0), [skillGroups]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/github-activity")
      .then((response) => {
        if (!response.ok) throw new Error("GitHub unavailable");
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setGithubData(payload);
        setGithubStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setGithubStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight
    });
  }, [history]);

  const addHistory = (entry) => {
    setHistory((current) => [...current, entry]);
  };

  const scrollToSection = (id) => {
    document.querySelector(id)?.scrollIntoView();
  };

  const openExternal = (href) => {
    const openedWindow = window.open(href, "_blank", "noopener,noreferrer");
    if (openedWindow) {
      openedWindow.opener = null;
    }
  };

  const formatNumber = (value) => new Intl.NumberFormat("en").format(value || 0);

  const githubLines = () => {
    if (githubStatus === "loading") {
      return ["GitHub activity is still loading. Try `github` again in a moment."];
    }
    if (githubStatus === "error" || !githubData) {
      return ["Unable to load GitHub contribution data right now.", `Profile: ${siteConfig.socials.github}`];
    }
    return [
      `GitHub: ${githubData.username}`,
      `Profile: ${githubData.profileUrl}`,
      `${formatNumber(githubData.totalContributions)} contributions in the last year`,
      `Current streak: ${githubData.currentStreak} day${githubData.currentStreak === 1 ? "" : "s"}`,
      `Longest streak: ${githubData.longestStreak} day${githubData.longestStreak === 1 ? "" : "s"}`,
      `Public repositories: ${githubData.publicRepos}`,
      `Followers: ${githubData.followers}`
    ];
  };

  const normalizeCommand = (value) => commandAliases[value] || value;

  const runCommand = (rawCommand) => {
    const trimmedCommand = rawCommand.trim();
    const command = normalizeCommand(trimmedCommand.toLowerCase());
    if (!command) return;

    addHistory({ type: "command", value: trimmedCommand });
    setCommandHistory((current) => [...current, trimmedCommand]);
    setHistoryIndex(null);

    if (command === "clear") {
      setHistory([]);
      return;
    }

    const projectLines = projects.flatMap((project) => [
      `${project.title}`,
      `  ${project.description}`,
      `  Tech: ${project.tech.join(", ")}`,
      `  GitHub: ${project.github}`,
      project.demo && project.demo !== "#" ? `  Live: ${project.demo}` : "  Live: Not available yet"
    ]);

    const commands = {
      help: [
        "Portfolio CLI",
        "",
        "GENERAL",
        "  about",
        "  whoami",
        "  skills",
        "  projects",
        "  experience",
        "  education",
        "",
        "SOCIAL",
        "  github",
        "  linkedin",
        "  instagram",
        "  email",
        "  resume",
        "  socials",
        "",
        "SYSTEM",
        "  status",
        "  help",
        "  clear",
        "  cls",
        "",
        "ALIASES",
        "  mail, open email",
        "  open github",
        "  open linkedin",
        "  insta, open instagram",
        "  cv, open resume",
        "",
        "NAVIGATION",
        "  contact"
      ],
      about: [
        siteConfig.name,
        `${siteConfig.title} based in ${siteConfig.location}`,
        siteConfig.tagline
      ],
      whoami: [siteConfig.name, siteConfig.title],
      skills: skillGroups.flatMap((group) => [`${group.title}:`, group.skills.join(", "), ""]).filter(Boolean),
      projects: projectLines,
      experience: experience.flatMap((item) => [
        `${item.role}`,
        `  ${item.company}`,
        `  ${item.period}`,
        ...item.responsibilities.map((responsibility) => `  - ${responsibility}`)
      ]),
      education: education.flatMap((item) => [
        `${item.degree}`,
        `  ${item.school}`,
        `  ${item.location}`,
        `  ${item.period}`,
        `  ${item.detail}`
      ]),
      socials: socialLinks.map((item) => `${item.label}: ${item.href}`),
      github: githubLines(),
      status: [
        "Portfolio status",
        `  Sections: home, about, terminal, skills, experience, projects, github-activity, education, contact`,
        `  Projects: ${projects.length}`,
        `  Skills: ${skillCount}`,
        `  Contact: ${contactMethods[0]?.value || siteConfig.email}`,
        `  GitHub data: ${githubStatus}${githubData ? ` (${formatNumber(githubData.totalContributions)} contributions)` : ""}`
      ]
    };

    if (command === "open github") {
      addHistory({ type: "output", lines: [...githubLines(), "", "Opening GitHub..."] });
      addHistory({ type: "link", label: "Open GitHub profile", href: siteConfig.socials.github });
      openExternal(siteConfig.socials.github);
      return;
    }

    if (command === "github") {
      addHistory({ type: "output", lines: [...githubLines(), "", "Opening GitHub..."] });
      addHistory({ type: "link", label: "Open GitHub profile", href: siteConfig.socials.github });
      openExternal(siteConfig.socials.github);
      return;
    }

    if (command === "linkedin") {
      addHistory({ type: "output", lines: ["Opening LinkedIn..."] });
      addHistory({ type: "link", label: "Open LinkedIn profile", href: siteConfig.socials.linkedin });
      openExternal(siteConfig.socials.linkedin);
      return;
    }

    if (command === "instagram") {
      addHistory({ type: "output", lines: ["Opening Instagram..."] });
      addHistory({ type: "link", label: "Open Instagram profile", href: siteConfig.socials.instagram });
      openExternal(siteConfig.socials.instagram);
      return;
    }

    if (command === "email") {
      const mailto = `mailto:${siteConfig.email}`;
      addHistory({ type: "output", lines: ["Opening email..."] });
      addHistory({ type: "link", label: siteConfig.email, href: mailto });
      window.location.href = mailto;
      return;
    }

    if (command === "resume") {
      addHistory({ type: "output", lines: ["Opening resume..."] });
      addHistory({ type: "link", label: "Open resume", href: siteConfig.resume });
      openExternal(siteConfig.resume);
      return;
    }

    if (command === "contact") {
      addHistory({ type: "output", lines: ["Opening contact section..."] });
      scrollToSection("#contact");
      return;
    }

    addHistory({
      type: "output",
      lines: commands[command] || [`Command not found: ${rawCommand}`, "Type `help` to see available commands."]
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (commandHistory.length === 0 || historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const value = input.trim().toLowerCase();
      if (!value) return;
      const match = commandList.find((item) => item.startsWith(value));
      if (match) setInput(match);
    }
  };

  return (
    <section id="terminal" className="section-shell" aria-labelledby="terminal-title">
      <div className="container-shell">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
        >
          <SectionHeading id="terminal-title" eyebrow="Developer Terminal" title="Explore the portfolio from the command line.">
            A small interactive shell that reuses the same projects, links, and skills shown across the site.
          </SectionHeading>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="glass mt-10 overflow-hidden rounded-[8px]"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex min-w-0 items-center justify-between gap-4 border-b border-white/10 bg-white/[0.035] px-4 py-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-red-400/90" />
              <span className="h-3 w-3 rounded-full bg-yellow-300/90" />
              <span className="h-3 w-3 rounded-full bg-green/90" />
            </div>
            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-white/70">
              <Terminal size={16} className="text-cyan" aria-hidden="true" />
              <span className="truncate">{prompt}</span>
            </div>
            <span className="hidden text-xs font-semibold text-white/36 sm:block">interactive</span>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[36rem] min-h-[28rem] overflow-y-auto p-4 font-mono text-sm leading-7 text-white/78 sm:min-h-[32rem] sm:p-5"
            aria-live="polite"
          >
            {history.map((entry, index) => {
              if (entry.type === "command") {
                return (
                  <p key={`${entry.type}-${index}`} className="break-words">
                    <span className="text-cyan">{prompt}</span>
                    <span className="text-white/44"> $ </span>
                    <span className="text-white">{entry.value}</span>
                  </p>
                );
              }

              if (entry.type === "link") {
                return (
                  <a
                    key={`${entry.type}-${index}`}
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="my-1 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-cyan transition hover:border-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  >
                    {entry.label}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                );
              }

              return (
                <div key={`${entry.type}-${index}`} className="mb-3 whitespace-pre-wrap break-words text-white/66">
                  {entry.lines.map((line) => (
                    <p key={`${index}-${line}`}>{line}</p>
                  ))}
                </div>
              );
            })}

            <form onSubmit={handleSubmit} className="flex min-w-0 items-center gap-1">
              <label htmlFor="terminal-command" className="sr-only">
                Terminal command
              </label>
              <span className="shrink-0 text-cyan">{prompt}</span>
              <span className="shrink-0 text-white/44">$</span>
              <input
                ref={inputRef}
                id="terminal-command"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-white outline-none caret-cyan"
                aria-label="Type a terminal command"
              />
              <span className="h-5 w-2 animate-pulse bg-cyan" aria-hidden="true" />
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
