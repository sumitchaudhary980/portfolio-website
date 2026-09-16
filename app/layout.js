import { Sora } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

const ogImage = `${siteConfig.url}/opengraph-image`;

export const metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.title}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: siteConfig.url,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati Province",
    addressCountry: "NP"
  },
  sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin, siteConfig.socials.instagram],
  knowsAbout: ["Full Stack Development", "HTML", "CSS", "JavaScript", "React", "PHP", "Laravel", "Node.js", "Cybersecurity", "Ethical Hacking"]
};

const profileSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: `${siteConfig.name} Portfolio`, publisher: { "@id": `${siteConfig.url}/#person` } },
    { "@type": "ProfilePage", "@id": `${siteConfig.url}/#profile`, url: siteConfig.url, name: `${siteConfig.name} | Full Stack Developer`, mainEntity: { "@id": `${siteConfig.url}/#person` }, isPartOf: { "@id": `${siteConfig.url}/#website` } }
  ]
};

const themeScript = `
try {
  var savedTheme = localStorage.getItem("theme");
  document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
} catch {
  document.documentElement.dataset.theme = "dark";
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable} data-theme="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
        <noscript><style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }`}</style></noscript>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
