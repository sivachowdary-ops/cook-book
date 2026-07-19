import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cook Book | Taste the Magic - Andhra & Telangana Delicacies",
  description: "Premium homemade sweets, snacks, pickles, and spices from Andhra & Telangana. Shipping to India, USA, and UK. Traditional taste, hygiene-packed.",
  keywords: "Andhra sweets online, Telangana snacks, traditional pickles, homemade spices, Indian food delivery USA UK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-cream text-text-dark font-sans selection:bg-primary selection:text-white">
        <Providers>
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}



