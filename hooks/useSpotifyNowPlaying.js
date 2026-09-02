"use client";

import { useEffect, useState } from "react";

const pollIntervalMs = 25000;
const subscribers = new Set();

let snapshot = {
  status: "loading",
  track: null
};
let poller = null;
let inFlight = null;

function notify() {
  subscribers.forEach((subscriber) => subscriber(snapshot));
}

async function loadNowPlaying() {
  if (inFlight) return inFlight;

  inFlight = fetch("/api/spotify/now-playing")
    .then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Spotify unavailable");
      snapshot = {
        status: payload.hasTrack ? "ready" : "empty",
        track: payload
      };
      notify();
    })
    .catch(() => {
      snapshot = {
        status: "error",
        track: null
      };
      notify();
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

function startPolling() {
  if (poller) return;
  loadNowPlaying();
  poller = window.setInterval(loadNowPlaying, pollIntervalMs);
}

function stopPolling() {
  if (subscribers.size > 0 || !poller) return;
  window.clearInterval(poller);
  poller = null;
}

export default function useSpotifyNowPlaying() {
  const [state, setState] = useState(snapshot);

  useEffect(() => {
    subscribers.add(setState);
    setState(snapshot);
    startPolling();

    return () => {
      subscribers.delete(setState);
      stopPolling();
    };
  }, []);

  return state;
}
