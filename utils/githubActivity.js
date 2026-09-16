let request;
let expiresAt = 0;

// The terminal and contribution graph share one in-flight request and short cache.
export function loadGitHubActivity() {
  if (!request || Date.now() > expiresAt) {
    expiresAt = Date.now() + 300000;
    request = fetch("/api/github-activity").then((response) => {
      if (!response.ok) throw new Error("GitHub activity unavailable");
      return response.json();
    }).catch((error) => { request = null; throw error; });
  }
  return request;
}
