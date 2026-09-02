"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Github, Loader2, Star } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/data/site";
import { viewportOnce } from "@/utils/motion";

function activityClass(level) {
  if (level >= 4) return "bg-green";
  if (level === 3) return "bg-cyan";
  if (level === 2) return "bg-violet";
  if (level === 1) return "bg-violet/55";
  return "bg-white/[0.055]";
}

function formatNumber(value) {
  return new Intl.NumberFormat("en").format(value || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export default function GitHubActivity() {
  const shouldReduceMotion = useReducedMotion();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/github-activity")
      .then((response) => {
        if (!response.ok) throw new Error("GitHub activity unavailable");
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setData(payload);
        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activity = data?.activity || [];

  return (
    <section id="github-activity" className="section-shell" aria-labelledby="github-activity-title">
      <div className="container-shell">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <SectionHeading id="github-activity-title" eyebrow="GitHub Activity" title="Public work, mapped in motion." />
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/72 transition hover:border-cyan/60 hover:bg-cyan/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan lg:justify-self-end"
          >
            <Github size={17} aria-hidden="true" />
            github.com/sumitchaudhary980
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="glass mt-10 rounded-[8px] p-5 md:p-7"
        >
          {status === "loading" ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-white/62" role="status">
              <Loader2 className="animate-spin text-cyan" size={20} aria-hidden="true" />
              Loading GitHub activity...
            </div>
          ) : null}

          {status === "error" ? (
            <div className="min-h-56 rounded-[8px] border border-white/10 bg-white/[0.035] p-5 text-white/66" role="status">
              Unable to load GitHub activity. The portfolio still links directly to the public profile.
            </div>
          ) : null}

          {status === "ready" && data ? (
            <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="min-w-0">
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-2xl font-bold text-white">{formatNumber(data.totalContributions)}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/42">last year</p>
                  </div>
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-2xl font-bold text-white">{data.currentStreak}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/42">current streak</p>
                  </div>
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-2xl font-bold text-white">{data.longestStreak}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/42">longest streak</p>
                  </div>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="grid w-max grid-flow-col grid-rows-7 gap-1" aria-label="GitHub contribution heatmap for the last year">
                    {activity.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        onMouseEnter={() => setActiveDay(day)}
                        onFocus={() => setActiveDay(day)}
                        onClick={() => setActiveDay(day)}
                        title={`${formatDate(day.date)}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                        className={`h-4 w-4 rounded-[3px] border border-white/10 transition hover:ring-2 hover:ring-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${activityClass(day.level)}`}
                        aria-label={`${day.count} GitHub contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/42">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span key={level} className={`h-3 w-3 rounded-[3px] border border-white/10 ${activityClass(level)}`} aria-hidden="true" />
                  ))}
                  <span>More</span>
                  {data.contributionPeriod?.from && data.contributionPeriod?.to ? (
                    <span className="ml-auto text-white/36">
                      {formatDate(data.contributionPeriod.from)} - {formatDate(data.contributionPeriod.to)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-sm font-semibold text-white">
                    {activeDay ? formatDate(activeDay.date) : "Hover or focus a day"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    {activeDay
                      ? `${activeDay.count} contribution${activeDay.count === 1 ? "" : "s"} recorded in GitHub's contribution calendar.`
                      : "Use keyboard focus or pointer hover to inspect daily contribution details."}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {data.repos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-[8px] border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan/40 hover:bg-cyan/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-white group-hover:text-cyan">{repo.name}</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-white/48">
                        <Star size={13} aria-hidden="true" />
                        {repo.stars}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/56">{repo.description || "Public GitHub repository"}</p>
                    <p className="mt-3 text-xs font-semibold text-white/42">{repo.language || "Code"}</p>
                  </a>
                ))}
                <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                  <h3 className="font-semibold text-white">Recent public activity</h3>
                  <div className="mt-3 grid gap-2">
                    {data.recentEvents.slice(0, 3).map((event) => (
                      <a
                        key={`${event.type}-${event.repo}-${event.date}`}
                        href={event.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm leading-6 text-white/56 transition hover:text-cyan focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-cyan"
                      >
                        {event.type} in {event.repo.split("/").pop()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
