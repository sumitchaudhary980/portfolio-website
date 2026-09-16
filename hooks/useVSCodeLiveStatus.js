"use client";

import { useSyncExternalStore } from "react";

const offline = { status: "Offline", coding: false, project: "", file: "", language: "", lastSeen: null };
let state = offline;
let timer;
let controller;
const listeners = new Set();
const getSnapshot = () => state;
const getServerSnapshot = () => offline;

async function loadStatus() {
  if (document.hidden || controller) return;
  const request = new AbortController();
  controller = request;
  try {
    const response = await fetch("/api/vscode/status", { cache: "no-store", signal: request.signal });
    if (!response.ok) throw new Error("Status unavailable");
    const payload = await response.json();
    if (!request.signal.aborted) state = payload;
  } catch {
    if (!request.signal.aborted) state = offline;
  } finally {
    if (controller === request) controller = null;
    if (!request.signal.aborted) listeners.forEach((listener) => listener());
  }
}

function visibility() {
  clearInterval(timer);
  if (document.hidden) { controller?.abort(); controller = null; return; }
  loadStatus();
  timer = setInterval(loadStatus, 30000);
}

function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1) { visibility(); document.addEventListener("visibilitychange", visibility); }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer); controller?.abort(); controller = null;
      document.removeEventListener("visibilitychange", visibility);
    }
  };
}

export default function useVSCodeLiveStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
