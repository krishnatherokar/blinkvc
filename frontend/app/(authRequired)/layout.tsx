"use client";
import Loading from "@/components/Loading";
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
    if (isSignedIn === false)
      router.replace(`${process.env.NEXT_PUBLIC_CLERK_URL}/sign-up`);
  }, [isSignedIn]);

  if (!isLoaded) return <Loading />;

  if (isSignedIn) return children;
  return null;
}
