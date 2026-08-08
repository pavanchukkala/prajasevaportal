import type { Metadata } from "next";
import { Inter, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-telugu",
  subsets: ["telugu"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Srikalahasti Praja Seva Intelligence Platform",
    template: "%s | Srikalahasti Praja Seva",
  },
  description: "An AI-assisted citizen grievance and constituency intelligence platform for Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh.",
  keywords: ["Srikalahasti", "grievance", "citizen portal", "MLA", "Andhra Pradesh", "constituency", "praja seva"],
  authors: [{ name: "Pavan Chukkala" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://prajasevaportal.vercel.app",
    siteName: "Srikalahasti Praja Seva Intelligence Platform",
    title: "Srikalahasti Praja Seva Intelligence Platform",
    description: "AI-assisted citizen grievance platform for Srikalahasti constituency.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Srikalahasti Praja Seva Intelligence Platform",
    description: "AI-assisted citizen grievance platform for Srikalahasti constituency.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoTelugu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
