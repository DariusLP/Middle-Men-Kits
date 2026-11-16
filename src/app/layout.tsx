import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PaperAtmosphere } from "@/components/motion/paper-atmosphere";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { NavigationMotion } from "@/components/providers/navigation-motion";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Middle Men",
    template: "%s · Middle Men",
  },
  description:
    "Weekly soccer kits from Middle Men — customise and request on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="relative flex min-h-full flex-col antialiased">
        <PaperAtmosphere />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <NavigationMotion />
          <ScrollProgress />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
