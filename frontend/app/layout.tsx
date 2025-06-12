import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blinkvc",
  description: "A basic Next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
