import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { WebSocketProvider } from "@/contexts/WSContext";
import { UserProvider } from "@/contexts/UserContext";

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
    <ClerkProvider>
    <WebSocketProvider>
    <UserProvider>
      <html lang="en">
        <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
          <Navbar />
          {children}
        </body>
      </html>
    </UserProvider>
    </WebSocketProvider>
    </ClerkProvider>
  );
}
