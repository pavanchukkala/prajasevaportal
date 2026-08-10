import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import MeetDeveloperButton from "@/components/layout/MeetDeveloperButton";
import CacheFreshnessCleanup from "@/components/layout/CacheFreshnessCleanup";

export const metadata: Metadata = {
  title: {
    default: "Srikalahasti Praja Seva Intelligence Platform",
    template: "%s | Srikalahasti Praja Seva",
  },
  description:
    "A proposed AI-assisted public service and constituency intelligence platform for Srikalahasti Assembly Constituency No. 168, Tirupati District, Andhra Pradesh. Submit and track public grievances, access department information, and explore constituency data.",
  keywords: [
    "Srikalahasti", "constituency", "grievance", "public service", "Tirupati",
    "Andhra Pradesh", "civic tech", "MLA", "TDP", "complaints", "AI analysis",
  ],
  icons: {
    icon: "/assets/symbols/civic-emblem.svg",
    shortcut: "/assets/symbols/civic-emblem.svg",
    apple: "/assets/symbols/civic-emblem.svg",
  },
  openGraph: {
    title: "Srikalahasti Praja Seva Intelligence Platform",
    description: "Proposed civic-technology platform for Srikalahasti constituency.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#060F1E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <CacheFreshnessCleanup />
            {children}
            <MeetDeveloperButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
