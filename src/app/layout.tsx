import type { Metadata } from "next";
import BackgroundCanvas from "@/components/cosmic/BackgroundCanvas";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmos | Vedic Astro + Numerology",
  description: "Ancient Jyotish + numerology, distilled into a conversation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load fonts via <link> to avoid next/font Google fetch failures in restricted networks */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@100..900&family=Tiro+Devanagari+Sanskrit&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <BackgroundCanvas />
        {children}
      </body>
    </html>
  );
}
