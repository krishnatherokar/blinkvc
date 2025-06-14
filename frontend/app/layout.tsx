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
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
