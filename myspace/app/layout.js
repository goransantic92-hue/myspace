import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Nav from "@/components/layout/Nav";
import BootLoader from "@/components/layout/BootLoader";
import TextReveal from "@/components/layout/TextReveal";
import { BRAND, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, TAGLINE } from "@/lib/brand";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen-grotesk",
  weight: ["400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
});

const metadataBase = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : SITE_URL,
);

export const metadata = {
  metadataBase,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: SITE_TITLE,
    description: TAGLINE,
    url: "/",
    siteName: BRAND,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: TAGLINE,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${familjen.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SmoothScroll />
        <Nav />
        <BootLoader>{children}</BootLoader>
        <TextReveal />
        <p className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex h-7 items-center justify-center bg-[#2A2725]/92 px-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#EDE6D6]/75">
          Concept prepared for SABAT by G8Flow
        </p>
      </body>
    </html>
  );
}
