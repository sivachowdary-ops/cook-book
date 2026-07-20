import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";

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
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
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



