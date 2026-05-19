import type { Metadata } from "next";
import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { PageTransition } from "@/components/providers/PageTransition";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CaloMate",
  description: "Theo dõi calo và dinh dưỡng hàng ngày",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />

        {/* Material Symbols */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YW2B5LPCB2"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments);
              }

              window.gtag = gtag;

              gtag('js', new Date());

              gtag('config', 'G-YW2B5LPCB2', {
                send_page_view: false
              });
            `,
          }}
        />
      </head>

      <body className="h-full flex flex-col bg-[#f4fbf6] text-[#161d1a]">
        {/* Track page changes */}
        <AnalyticsProvider />

        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}