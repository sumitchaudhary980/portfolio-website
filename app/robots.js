import { siteConfig } from "@/data/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/"
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
