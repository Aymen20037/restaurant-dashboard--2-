import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionGuard } from "./components/SessionGuard"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Droovo Dashboard - Gestion Restaurant",
  description: "Dashboard professionnel pour la gestion de votre restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionGuard>
            {children}
          </SessionGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
