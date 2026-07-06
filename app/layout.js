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
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/"
  },
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
        alt: `${siteConfig.name} - ${siteConfig.title}`
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    images: [ogImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
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
  knowsAbout: ["Full Stack Development", "React", "Next.js", "Laravel", "Node.js", "Tailwind CSS"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
