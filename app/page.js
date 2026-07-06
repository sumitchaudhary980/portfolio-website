export const metadata = {
  title: `${siteConfig.name} - Full Stack Developer Portfolio`,
  description:
    "Explore the full stack development portfolio of Sumit Kumar Chaudhary, including scalable web applications, Laravel marketplaces, React interfaces, and modern backend systems.",

  verification: {
    google: "76tGA8Fr2ZSJ_2GDg5bD7sT26lmnZGZuObp1z3ChezQ",
  },

  keywords: [
    ...siteConfig.keywords,
    "Full stack portfolio",
    "Web application developer",
    "Frontend developer",
    "Backend developer",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: `${siteConfig.name} - Full Stack Developer Portfolio`,
    description:
      "Modern portfolio showcasing scalable web applications, clean architecture, and thoughtful user experiences by Sumit Kumar Chaudhary.",
    url: siteConfig.url,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio preview`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Full Stack Developer Portfolio`,
    description:
      "Full Stack Developer building scalable web applications with modern technologies and polished user experiences.",
    images: ["/opengraph-image"],
  },
};