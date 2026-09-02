"use client";

import { useEffect, useState } from "react";

const pollIntervalMs = 30000;

export default function useVSCodeLiveStatus() {
  const [state, setState] = useState({
    status: "Offline",
    coding: false,
    project: "",
    file: "",
    language: "",
    lastSeen: null
  });

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      try {
        const response = await fetch("/api/vscode/status", {
          cache: "no-store"
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload.error || "VS Code status unavailable"
          );
        }

        if (isMounted) {
          setState(payload);
        }
      } catch (error) {
        if (isMounted) {
          setState({
            status: "Offline",
            coding: false,
            project: "",
            file: "",
            language: "",
            lastSeen: null
          });
        }
      }
    };

    loadStatus();

    const interval = window.setInterval(
      loadStatus,
      pollIntervalMs
    );

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}