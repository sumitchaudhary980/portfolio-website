import { NextResponse } from "next/server";

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const nowPlayingEndpoint = "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track";
const cacheTtlMs = 15000;

let cachedAccessToken = null;
let accessTokenExpiresAt = 0;
let cachedPayload = null;
let cachedPayloadAt = 0;

function missingConfig() {
  return !process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN;
}

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < accessTokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

function formatTrack(payload) {
  const item = payload?.item;
  if (!item || item.type !== "track") {
    return {
      isPlaying: false,
      hasTrack: false,
      message: "Nothing playing right now"
    };
  }

  return {
    isPlaying: Boolean(payload.is_playing),
    hasTrack: true,
    title: item.name,
    artist: item.artists?.map((artist) => artist.name).join(", ") || "Unknown artist",
    album: item.album?.name || "",
    albumArt: item.album?.images?.[0]?.url || "",
    spotifyUrl: item.external_urls?.spotify || "",
    uri: item.uri || "",
    progressMs: payload.progress_ms || 0,
    durationMs: item.duration_ms || 0,
    fetchedAt: Date.now()
  };
}

export async function GET() {
  if (missingConfig()) {
    return NextResponse.json(
      {
        isConfigured: false,
        isPlaying: false,
        hasTrack: false,
        message: "Spotify is not configured yet"
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  if (cachedPayload && Date.now() - cachedPayloadAt < cacheTtlMs) {
    return NextResponse.json(cachedPayload, { headers: { "Cache-Control": "private, max-age=10" } });
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(nowPlayingEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (response.status === 204) {
      cachedPayload = {
        isConfigured: true,
        isPlaying: false,
        hasTrack: false,
        message: "Nothing playing right now"
      };
      cachedPayloadAt = Date.now();
      return NextResponse.json(cachedPayload, { headers: { "Cache-Control": "private, max-age=10" } });
    }

    if (response.status === 429) {
      return NextResponse.json(
        {
          isConfigured: true,
          isPlaying: false,
          hasTrack: false,
          message: "Spotify rate limit reached"
        },
        {
          status: 429,
          headers: {
            "Retry-After": response.headers.get("retry-after") || "30",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    if (!response.ok) {
      throw new Error(`Spotify now-playing request failed: ${response.status}`);
    }

    const payload = await response.json();
    cachedPayload = {
      isConfigured: true,
      ...formatTrack(payload)
    };
    cachedPayloadAt = Date.now();

    return NextResponse.json(cachedPayload, { headers: { "Cache-Control": "private, max-age=10" } });
  } catch (error) {
    return NextResponse.json(
      {
        isConfigured: true,
        isPlaying: false,
        hasTrack: false,
        message: "Unable to load Spotify activity"
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
