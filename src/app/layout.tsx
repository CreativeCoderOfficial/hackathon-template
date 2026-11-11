import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/core/ui/tokens.css";
import { AnalyticsProvider } from "@/core/analytics";
import { SiteNav } from "./site-nav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Helsinki place reports",
  description: "Report and prioritise infrastructure and traffic problems in Helsinki",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider />
          <SiteNav />
          <main className="mx-auto w-full max-w-5xl p-5">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
