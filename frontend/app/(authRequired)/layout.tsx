"use client";
import Loading from "@/components/Loading";
import { RedirectToSignUp, useUser } from "@clerk/nextjs";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return <RedirectToSignUp />;
  return children;
}
