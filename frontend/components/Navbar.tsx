"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import { MdOutlineCall } from "react-icons/md";
import { RiHomeLine } from "react-icons/ri";
import { AiOutlineUserAdd } from "react-icons/ai";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [theme, setTheme] = useState<typeof dark | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? dark : undefined);
    };

    setTheme(darkMode.matches ? dark : undefined);
    darkMode.addEventListener("change", listener);
    return () => darkMode.removeEventListener("change", listener);
  }, []);

  const linkClass = (href: string) =>
    pathname === href ? "text-blue-600" : "";

  return (
    <header
      className="fixed z-4 w-full h-16 text-md bg-neutral-100 rounded-t-2xl p-4
      dark:bg-neutral-900 dark:text-gray-400
      sm:w-sm sm:rounded-tl-2xl sm:rounded-tr-none
      bottom-0 right-0 flex justify-evenly items-center gap-4"
    >
      <Link href={"/"}>
        <RiHomeLine className={`h-8 w-8 ${linkClass("/")}`} />
      </Link>
      <Link href={"/requests"}>
        <AiOutlineUserAdd className={`h-8 w-8 ${linkClass("/requests")}`} />
      </Link>
      <Link href={"/call"}>
        <MdOutlineCall className={`h-8 w-8 ${linkClass("/call")}`} />
      </Link>
      <SignedIn>
        <div className="scale-125 mt-1">
          <UserButton
            userProfileMode="navigation"
            userProfileUrl={`${process.env.NEXT_PUBLIC_CLERK_URL}/user`}
            appearance={{ baseTheme: theme }}
          />
        </div>
      </SignedIn>
    </header>
  );
};

export default Navbar;
