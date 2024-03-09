'use client'
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { RecoilRoot } from "recoil";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <main>{children}</main>
          <Toaster />
        </RecoilRoot>
      </body>
    </html>
  );
}
