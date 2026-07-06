import { siteConfig } from "@/data/site";

export default function sitemap() {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
