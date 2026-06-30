// RootLayout — global layout, metadata, theme script, providers

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

// Load Geist fonts and assign CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page metadata
export const metadata: Metadata = {
  title: "RepoSplit",
  description: "Intelligent RAG system for codebase understanding",
};

// Root layout — applies fonts, inline theme script, and context providers
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== "undefined") {
    console.log("%c🥚 RepoSplit by Ayush Singh 🥚", "font-size:20px; font-weight:bold; color:#8b5cf6;");
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to restore saved theme before hydration */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.className=t;document.body.className=t}else{document.documentElement.className='dark';document.body.className='dark'}}catch(e){}})()`
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
