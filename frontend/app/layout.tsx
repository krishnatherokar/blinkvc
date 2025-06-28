import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { WebSocketProvider } from "@/contexts/WSContext";
import { UserProvider } from "@/contexts/UserContext";
import { ToastProvider } from "@/contexts/GlobalToastContext";

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
      <ToastProvider>
        <WebSocketProvider>
          <UserProvider>
            <html lang="en">
              <body className="bg-white text-neutral-800 dark:bg-black dark:text-white">
                <Navbar />
                {children}
              </body>
            </html>
          </UserProvider>
        </WebSocketProvider>
      </ToastProvider>
    </ClerkProvider>
  );
}
