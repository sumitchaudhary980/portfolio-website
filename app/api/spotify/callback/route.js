import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSpotifyRedirectUri, isSpotifyOAuthSetupAllowed, spotifyStateCookieName, spotifyTokenEndpoint } from "@/app/api/spotify/oauth";

function missingConfig() {
  return !process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET;
}

function htmlResponse(body, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resultPage({ title, message, refreshToken, redirectUri, isError = false }) {
  const safeRefreshToken = refreshToken ? escapeHtml(refreshToken) : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: dark; }
      body {
        min-height: 100vh;
        margin: 0;
        display: grid;
        place-items: center;
        background: #0b0b0f;
        color: #fff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(720px, calc(100vw - 32px));
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 8px;
        padding: 28px;
        background: linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.035));
        box-shadow: 0 24px 80px rgba(0,0,0,.24);
      }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { color: rgba(255,255,255,.68); line-height: 1.7; }
      code, textarea {
        font: 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
      textarea {
        width: 100%;
        min-height: 112px;
        box-sizing: border-box;
        border: 1px solid rgba(6,182,212,.35);
        border-radius: 8px;
        background: rgba(255,255,255,.04);
        color: #fff;
        padding: 12px;
      }
      .pill {
        display: inline-block;
        margin-top: 10px;
        border: 1px solid ${isError ? "rgba(248,113,113,.45)" : "rgba(34,197,94,.45)"};
        border-radius: 999px;
        padding: 6px 10px;
        color: ${isError ? "#fca5a5" : "#86efac"};
        font-size: 13px;
        font-weight: 700;
      }
      .hint { font-size: 13px; color: rgba(255,255,255,.5); }
    </style>
  </head>
  <body>
    <main>
      <span class="pill">${isError ? "OAuth failed" : "Refresh token obtained"}</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      ${refreshToken ? `<label>
        <span class="hint">Copy this value into <code>.env.local</code> as <code>SPOTIFY_REFRESH_TOKEN</code>. Do not commit it.</span>
        <textarea readonly aria-label="Spotify refresh token">${safeRefreshToken}</textarea>
      </label>` : ""}
      <p class="hint">Redirect URI used: <code>${escapeHtml(redirectUri || "")}</code></p>
    </main>
  </body>
</html>`;
}

export async function GET(request) {
  const redirectUri = getSpotifyRedirectUri(request);

  if (!isSpotifyOAuthSetupAllowed()) {
    return htmlResponse(
      resultPage({
        title: "Spotify OAuth setup is disabled",
        message: "This token setup route is available only during local development. Production visitors cannot use it to authorize Spotify.",
        redirectUri,
        isError: true
      }),
      404
    );
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(spotifyStateCookieName)?.value;
  const receivedState = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    const response = htmlResponse(
      resultPage({
        title: "Spotify authorization was not completed",
        message: `Spotify returned: ${error}`,
        redirectUri,
        isError: true
      }),
      400
    );
    response.cookies.set(spotifyStateCookieName, "", { maxAge: 0, path: "/api/spotify" });
    return response;
  }

  if (missingConfig()) {
    return htmlResponse(
      resultPage({
        title: "Spotify OAuth is not configured",
        message: "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET locally, then open the login URL again.",
        redirectUri,
        isError: true
      }),
      500
    );
  }

  if (!code || !expectedState || receivedState !== expectedState) {
    const response = htmlResponse(
      resultPage({
        title: "Spotify OAuth state check failed",
        message: "Start again from /api/spotify/login so the callback can verify the OAuth state safely.",
        redirectUri,
        isError: true
      }),
      400
    );
    response.cookies.set(spotifyStateCookieName, "", { maxAge: 0, path: "/api/spotify" });
    return response;
  }

  try {
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
    const tokenResponse = await fetch(spotifyTokenEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      }),
      cache: "no-store"
    });

    if (!tokenResponse.ok) {
      throw new Error(`Spotify token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.refresh_token) {
      throw new Error("Spotify did not return a refresh token");
    }

    const response = htmlResponse(
      resultPage({
        title: "Spotify refresh token ready",
        message: "Your refresh token was obtained locally. Copy it into .env.local, restart the dev server, and the Now Listening endpoint can use it.",
        refreshToken: tokenData.refresh_token,
        redirectUri
      })
    );
    response.cookies.set(spotifyStateCookieName, "", { maxAge: 0, path: "/api/spotify" });
    return response;
  } catch (exchangeError) {
    const response = htmlResponse(
      resultPage({
        title: "Spotify token exchange failed",
        message: "Spotify did not return a refresh token. Confirm your Client ID, Client Secret, and exact Redirect URI, then try again.",
        redirectUri,
        isError: true
      }),
      502
    );
    response.cookies.set(spotifyStateCookieName, "", { maxAge: 0, path: "/api/spotify" });
    return response;
  }
}
