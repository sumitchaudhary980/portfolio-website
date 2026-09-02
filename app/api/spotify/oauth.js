export const spotifyAuthorizeEndpoint = "https://accounts.spotify.com/authorize";
export const spotifyTokenEndpoint = "https://accounts.spotify.com/api/token";
export const spotifyOAuthScope = "user-read-currently-playing";
export const spotifyStateCookieName = "spotify_oauth_state";

export function isSpotifyOAuthSetupAllowed() {
  return process.env.NODE_ENV !== "production";
}

export function getSpotifyRedirectUri(request) {
  const host = request.headers.get("host") || "";
  const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (isLocalHost) {
    return "http://127.0.0.1:3000/api/spotify/callback";
  }

  return `${request.nextUrl.origin}/api/spotify/callback`;
}
