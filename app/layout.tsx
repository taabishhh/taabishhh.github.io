import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/archivo/standard.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taabish Sutriwala · Software Engineer",
  description:
    "Software engineer building cloud, mobile and AI systems. Currently building clinical gait-analysis software at the University of Illinois Chicago.",
  metadataBase: new URL("https://taabish.tech"),
  openGraph: {
    title: "Taabish Sutriwala · Software Engineer",
    description: "Software engineer building cloud, mobile and AI systems.",
    type: "website",
    url: "https://taabish.tech/",
    images: ["/portrait.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8ecee" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1418" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
