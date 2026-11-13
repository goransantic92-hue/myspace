import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Nav from "@/components/layout/Nav";
import BootLoader from "@/components/layout/BootLoader";
import TextReveal from "@/components/layout/TextReveal";
import { BRAND, SITE_URL } from "@/lib/brand";

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

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND} — Contemporary Architecture & Residences`,
  description: `Discover ${BRAND}, a study in contemporary residential architecture, considered spaces, material, and light. Explore the residences through immersive 3D experiences.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND} — Space, considered.`,
    description: "Residences shaped by architecture, light, and material.",
    url: "/",
    siteName: BRAND,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — Space, considered.`,
    description: "Residences shaped by architecture, light, and material.",
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
      </body>
    </html>
  );
}
