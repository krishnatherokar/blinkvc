"use client";
import { RedirectToSignUp, SignedIn, SignedOut } from "@clerk/nextjs";

export default function ProtectedPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignUp />
      </SignedOut>
    </>
  );
  return null;
}
