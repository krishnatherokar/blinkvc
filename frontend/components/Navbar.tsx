"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dark } from "@clerk/themes";

const Navbar = () => {
  const [theme, setTheme] = useState<typeof dark | undefined>(undefined);

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? dark : undefined);
    };

    setTheme(darkMode.matches ? dark : undefined);
    darkMode.addEventListener("change", listener);
    return () => darkMode.removeEventListener("change", listener);
  }, []);

  return (
    <header className="text-md bg-neutral-200 dark:bg-neutral-900 dark:text-gray-400 fixed w-full md:w-2xl md:rounded-tl-xl bottom-0 right-0 flex justify-evenly items-center p-4 gap-4 h-16 z-4">
      <Link href={"/"}>Home</Link>
      <Link href={"/connect"}>Connect</Link>
      <Link href={"/call/missed"}>Calls</Link>
      <Link href={"/requests"}>Requests</Link>
      <SignedIn>
        <UserButton
          userProfileMode="navigation"
          userProfileUrl={`${process.env.NEXT_PUBLIC_CLERK_URL}/user`}
          appearance={{ baseTheme: theme }}
        />
      </SignedIn>
    </header>
  );
};
export default Navbar;
