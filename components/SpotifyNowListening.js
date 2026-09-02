"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Headphones, Loader2, Music2, Pause, Play } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { viewportOnce } from "@/utils/motion";

const pollIntervalMs = 25000;

function formatTime(value) {
  const totalSeconds = Math.max(0, Math.floor((value || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function spotifyEmbedUrl(spotifyUrl) {
  const match = spotifyUrl?.match(/spotify\.com\/track\/([^?]+)/);
  return match ? `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator` : "";
}

export default function SpotifyNowListening() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [track, setTrack] = useState(null);
  const [progressMs, setProgressMs] = useState(0);
  const [listenAlong, setListenAlong] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const loadNowPlaying = async () => {
    try {
      const response = await fetch("/api/spotify/now-playing");
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Spotify unavailable");
      setTrack(payload);
      setProgressMs(payload.progressMs || 0);
      setStatus(payload.hasTrack ? "ready" : "empty");
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadNowPlaying();
    const interval = window.setInterval(loadNowPlaying, pollIntervalMs);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!track?.isPlaying || !track.durationMs) return undefined;
    const interval = window.setInterval(() => {
      setProgressMs((current) => Math.min(current + 1000, track.durationMs));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [track?.durationMs, track?.isPlaying]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0, 0.45, 0.7] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const progressPercent = track?.durationMs ? Math.min(100, (progressMs / track.durationMs) * 100) : 0;
  const embedUrl = useMemo(() => spotifyEmbedUrl(track?.spotifyUrl), [track?.spotifyUrl]);
  const showEmbed = listenAlong && isSectionVisible && embedUrl;

  return (
    <section ref={sectionRef} id="spotify-now-listening" className="section-shell" aria-labelledby="spotify-now-listening-title">
      <div className="container-shell">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="mx-auto max-w-4xl text-center"
        >
          <SectionHeading id="spotify-now-listening-title" eyebrow="Spotify" title="Now Listening" align="center">
            A live glimpse at what is playing from my Spotify account, refreshed through a secure server-side API.
          </SectionHeading>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce()}
          className="glass mx-auto mt-10 max-w-3xl overflow-hidden rounded-[8px] p-5 md:p-6"
        >
          {status === "loading" ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-white/62" role="status">
              <Loader2 className="animate-spin text-cyan" size={20} aria-hidden="true" />
              Loading Spotify activity...
            </div>
          ) : null}

          {status === "error" ? (
            <div className="grid min-h-64 place-items-center rounded-[8px] border border-white/10 bg-white/[0.035] p-5 text-center text-white/62" role="status">
              Unable to load Spotify activity.
            </div>
          ) : null}

          {status === "empty" ? (
            <div className="grid min-h-64 place-items-center rounded-[8px] border border-white/10 bg-white/[0.035] p-5 text-center">
              <div>
                <Music2 className="mx-auto text-cyan" size={34} aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold text-white">{track?.message || "Nothing playing right now"}</p>
                <p className="mt-2 text-sm text-white/52">Check back when Spotify is active.</p>
              </div>
            </div>
          ) : null}

          {status === "ready" && track?.hasTrack ? (
            <div className="grid gap-6 md:grid-cols-[13rem_1fr] md:items-center">
              <div className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035]">
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={`${track.album} album artwork`}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid aspect-square place-items-center text-cyan">
                    <Music2 size={42} aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-green/25 bg-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green">
                    {track.isPlaying ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
                    {track.isPlaying ? "Now Listening" : "Paused"}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/36">Spotify</span>
                </div>

                <h3 className="mt-4 truncate text-2xl font-bold text-white md:text-3xl">{track.title}</h3>
                <p className="mt-2 truncate text-base font-semibold text-cyan">{track.artist}</p>
                {track.album ? <p className="mt-1 truncate text-sm text-white/48">{track.album}</p> : null}

                <div className="mt-6" aria-label="Playback progress">
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-green transition-[width] duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-xs text-white/46">
                    <span>{formatTime(progressMs)}</span>
                    <span>{formatTime(track.durationMs)}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setListenAlong(true)}
                    disabled={!embedUrl}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-violet/50 bg-violet px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:border-cyan/70 hover:bg-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Headphones size={16} aria-hidden="true" />
                    Listen Along
                  </button>
                  {track.spotifyUrl ? (
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/72 transition hover:border-cyan/60 hover:bg-cyan/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    >
                      Open in Spotify
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>

                {listenAlong ? (
                  <div className="mt-5 rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
                    {showEmbed ? (
                      <iframe
                        title={`Listen along to ${track.title} on Spotify`}
                        src={embedUrl}
                        width="100%"
                        height="152"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-[8px]"
                      />
                    ) : (
                      <p className="text-sm leading-6 text-white/56">
                        Listen Along is paused while this section is out of view. It only affects this embedded Spotify player.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
