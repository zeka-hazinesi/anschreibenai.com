import { ThemeProvider as NextThemesProvider } from "next-themes";
import { unstable_ViewTransition as ViewTransition } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import Navbar from "./navbar";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Anschreibenai.com - AI powered cover letter generator",
  description:
    "Erstellen Sie professionelle Anschreiben mit KI-Unterstützung. AnschreibenAI generiert individuelle und überzeugende Bewerbungsschreiben in wenigen Minuten für Ihren Bewerbungserfolg.",
  keywords: [
    "Anschreiben",
    "Bewerbungsschreiben",
    "Cover Letter",
    "KI",
    "Künstliche Intelligenz",
    "Bewerbung",
    "Lebenslauf",
  ],
  openGraph: {
    title: "anschreibenai.com - AI powered cover letter generator",
    description:
      "Erstellen Sie professionelle Anschreiben mit KI-Unterstützung. AnschreibenAI generiert individuelle und überzeugende Bewerbungsschreiben in wenigen Minuten.",
    url: "https://www.anschreibenai.com",
    type: "website",
    siteName: "anschreibenai.com",
    locale: "de_DE",
    images: [
      {
        url: "https://www.anschreibenai.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "anschreibenai.com - AI powered cover letter generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anschreibenai.com - AI powered cover letter generator",
    description:
      "Erstellen Sie professionelle Anschreiben mit KI-Unterstützung. AnschreibenAI generiert individuelle und überzeugende Bewerbungsschreiben in wenigen Minuten.",
    site: "@AnschreibenAI", // Optional: Twitter-Handle anpassen
    images: ["https://www.anschreibenai.com/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon.png",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.anschreibenai.com",
    languages: {
      de: "https://www.anschreibenai.com/de",
      en: "https://www.anschreibenai.com/en",
    },
  },
  manifest: "/site.webmanifest",
  authors: [
    {
      name: "Poyraz Digital",
      url: "https://www.anschreibenai.com",
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <NextIntlClientProvider>
        <ViewTransition>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="flex h-auto w-full flex-col items-center justify-center">
                <Navbar></Navbar>
              </div>
              <div className="flex h-full min-h-[100dvh] w-full justify-center font-[family-name:var(--font-geist-sans)]">
                <div className="flex h-full w-full flex-1 items-center justify-center">{children}</div>
              </div>
            </NextThemesProvider>
          </body>
        </ViewTransition>
      </NextIntlClientProvider>
    </html>
  );
}
