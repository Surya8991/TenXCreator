import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TenX Creator — AI-Powered Creator Business Advisor",
  description: "Your AI chief of staff for your creator business. Content strategy, brand deals, tax, finance, and tech across YouTube, Instagram, TikTok, X, LinkedIn — in 20 countries.",
  keywords: ["YouTube", "Instagram", "TikTok", "LinkedIn", "creator", "brand deals", "SEO", "content strategy", "AI advisor", "social media", "creator economy"],
  manifest: "/manifest.json",
  openGraph: {
    title: "TenX Creator — Your AI Chief of Staff",
    description: "One advisor that masters every platform. Content strategy, brand deals, tax, finance — across 20 countries.",
    type: "website",
    siteName: "TenX Creator",
  },
  twitter: {
    card: "summary_large_image",
    title: "TenX Creator — Your AI Chief of Staff",
    description: "One advisor that masters every platform. Content strategy, brand deals, tax, finance — across 20 countries.",
  },
};

// Inline script to set theme class before React hydrates — prevents flash
const themeScript = `
  try {
    const t = localStorage.getItem('tenx-theme');
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Safe: themeScript is a build-time constant, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-950 text-white" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
