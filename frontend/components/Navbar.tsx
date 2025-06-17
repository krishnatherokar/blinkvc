"use client";
import "@/app/globals.css";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();

  return (
    <header className="text-md text-gray-400 fixed w-full top-0 left-0 flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton>Sign In</SignInButton>
        <SignUpButton>Sign Up</SignUpButton>
      </SignedOut>
      <SignedIn>
        Hello {user?.username}
        <UserButton />
      </SignedIn>
    </header>
  );
};
export default Navbar;
