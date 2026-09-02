import { NextResponse } from "next/server";

const username = "sumitchaudhary980";
const featuredRepos = new Set([
  "library-management-system",
  "laravel-react-multi-vendor-ecommerce",
  "fullstack-chat-app",
  "mobile-cover-website",
  "mern-notes-website",
  "escape-room"
]);
const headers = {
  Accept: "application/vnd.github+json, text/html",
  "User-Agent": "sumit-portfolio"
};

export const revalidate = 3600;

async function fetchJson(url) {
  const response = await fetch(url, { headers, next: { revalidate } });
  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers, next: { revalidate } });
  if (!response.ok) {
    throw new Error(`GitHub contribution request failed: ${response.status}`);
  }
  return response.text();
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseContributionCalendar(html) {
  const totalMatch = html.match(/<h2[^>]*id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions/i);
  const dayPattern =
    /<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="([^"]+)"[^>]*class="ContributionCalendar-day"[^>]*><\/td>\s*<tool-tip[^>]*>(.*?)<\/tool-tip>/gis;
  const days = [];
  let match;

  while ((match = dayPattern.exec(html)) !== null) {
    const tooltip = decodeHtml(match[4].replace(/<[^>]*>/g, "").trim());
    const countMatch = tooltip.match(/([\d,]+)\s+contribution/i);
    const count = countMatch ? Number(countMatch[1].replace(/,/g, "")) : 0;
    days.push({
      date: match[1],
      count,
      level: Number(match[3]),
      tooltip
    });
  }

  const sortedDays = days.sort((a, b) => a.date.localeCompare(b.date));
  const calculatedTotal = sortedDays.reduce((sum, day) => sum + day.count, 0);

  return {
    days: sortedDays,
    totalContributions: calculatedTotal,
    displayedTotal: totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : calculatedTotal
  };
}

function calculateStreaks(days) {
  let longestStreak = 0;
  let runningStreak = 0;

  days.forEach((day) => {
    if (day.count > 0) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  });

  let currentStreak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count <= 0) break;
    currentStreak += 1;
  }

  return { currentStreak, longestStreak };
}

export async function GET() {
  try {
    const [user, events, repos, contributionsHtml] = await Promise.all([
      fetchJson(`https://api.github.com/users/${username}`),
      fetchJson(`https://api.github.com/users/${username}/events/public?per_page=100`),
      fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
      fetchText(`https://github.com/users/${username}/contributions`)
    ]);
    const contributionCalendar = parseContributionCalendar(contributionsHtml);
    const streaks = calculateStreaks(contributionCalendar.days);

    return NextResponse.json({
      username,
      profileUrl: `https://github.com/${username}`,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalContributions: contributionCalendar.totalContributions,
      displayedTotal: contributionCalendar.displayedTotal,
      contributionPeriod: {
        from: contributionCalendar.days[0]?.date || null,
        to: contributionCalendar.days[contributionCalendar.days.length - 1]?.date || null
      },
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      activity: contributionCalendar.days,
      recentEvents: events.slice(0, 6).map((event) => ({
        type: event.type.replace("Event", ""),
        repo: event.repo?.name || username,
        date: event.created_at,
        url: `https://github.com/${event.repo?.name || username}`
      })),
      repos: repos
        .filter((repo) => featuredRepos.has(repo.name))
        .slice(0, 4)
        .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updatedAt: repo.updated_at
      }))
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load GitHub activity right now.",
        profileUrl: `https://github.com/${username}`
      },
      { status: 502 }
    );
  }
}
