import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "SEVN AILAB",
    "Vibe Coding",
    "AI Agent",
    "MCP",
    "AI 产品",
    "独立开发者",
    "Claude Code",
    "Cursor",
  ],
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

/**
 * Resolves the theme before first paint so there is never a flash of the
 * wrong palette. Runs synchronously in <head>; deliberately tiny.
 */
const themeScript = `(function(){try{var s=localStorage.getItem("sevn-theme");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* Site-wide identity graph. Detail pages reference its `@id`s rather
            than restating the author, so this must be present on every route. */}
        <JsonLd data={websiteSchema()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
        >
          跳到主要内容
        </a>

        <SiteHeader />

        <main id="main" className="relative z-[1]">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
