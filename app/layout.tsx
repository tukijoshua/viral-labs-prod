import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Viral Labs – The Simple Content Coach",
  description: "See why your content works (and why it doesn't). Enterprise-grade content diagnostics powered by AI.",
  keywords: ["content analysis", "viral content", "AI content coach", "video analysis", "content optimization"],
  openGraph: {
    title: "Viral Labs – The Simple Content Coach",
    description: "See why your content works (and why it doesn't).",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={spaceGrotesk.variable}>
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
