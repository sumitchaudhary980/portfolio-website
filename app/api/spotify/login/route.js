import { NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  getSpotifyRedirectUri,
  isSpotifyOAuthSetupAllowed,
  spotifyAuthorizeEndpoint,
  spotifyOAuthScope,
  spotifyStateCookieName
} from "@/app/api/spotify/oauth";

function missingConfig() {
  return !process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET;
}

export async function GET(request) {
  if (!isSpotifyOAuthSetupAllowed()) {
    return NextResponse.json(
      {
        error: "Spotify OAuth setup is disabled in production."
      },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (missingConfig()) {
    return NextResponse.json(
      {
        error: "Spotify OAuth is not configured.",
        required: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"]
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const redirectUri = getSpotifyRedirectUri(request);
  const state = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: spotifyOAuthScope,
    redirect_uri: redirectUri,
    state,
    show_dialog: "true"
  });

  const response = NextResponse.redirect(`${spotifyAuthorizeEndpoint}?${params.toString()}`);
  response.cookies.set(spotifyStateCookieName, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: 600,
    path: "/api/spotify"
  });

  return response;
}
