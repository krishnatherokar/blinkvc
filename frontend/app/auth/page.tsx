"use client";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace("/");
  }, [isSignedIn]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <SignInButton>
        <button className="px-4 py-2 m-2 rounded-md bg-blue-500">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton>
        <button className="px-4 py-2 m-2 rounded-md bg-blue-500">
          Sign Up
        </button>
      </SignUpButton>
    </main>
  );
};
export default Navbar;
