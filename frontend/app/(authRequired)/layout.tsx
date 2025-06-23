"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn === false) router.replace("/auth");
  }, [isSignedIn]);

  if (!isLoaded) return null;

  if (isSignedIn)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        {children}
      </main>
    );
  return null;
}
