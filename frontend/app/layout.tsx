import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { WebSocketProvider } from "@/contexts/WSContext";
import { UserProvider } from "@/contexts/UserContext";
import { ToastProvider } from "@/contexts/GlobalToastContext";
import { Urbanist } from "next/font/google";

const fontFamily = Urbanist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlinkVC",
  description: "Video chat that connects you in a blink!",
  authors: [
    { name: "Krishna Therokar", url: "https://github.com/krishnatherokar" },
    {
      name: "Krishna Therokar",
      url: "https://linkedin.com/in/krishnatherokar",
    },
  ],
  generator: "Next.js",
  keywords: [
    "BlinkVC",
    "video chat",
    "random video call",
    "online video call",
    "instant video call",
    "peer to peer call",
  ],
  applicationName: "BlinkVC",
  creator: "Krishna Therokar",
  publisher: "BlinkVC",
  openGraph: {
    title: "BlinkVC",
    description: "Video chat that connects you in a blink!",
    url: "https://blinkvc.vercel.app",
    siteName: "BlinkVC",
    type: "website",
  },
  twitter: {
    title: "BlinkVC",
    description: "Video chat that connects you in a blink!",
    creator: "@krishnatherokar",
  },
  icons: {
    icon: "/images/favicon.svg",
    shortcut: "/images/favicon.svg",
  },
  metadataBase: new URL("https://blinkvc.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
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
            <html lang="en" className={fontFamily.className}>
              <body
                className="bg-white text-neutral-800
              dark:bg-black dark:text-white"
              >
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
