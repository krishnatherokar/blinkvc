"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex min-h-screen flex-col items-center justify-center p-4 pb-30"
    >
      {/* Floating github button */}
      <Link
        href="https://github.com/krishnatherokar/blinkvc"
        className="fixed z-4 top-0 left-0 p-2 text-sm text-neutral-500"
      >
        <FaGithub className="inline-block mr-1 mb-1 h-4 w-4" />
        GitHub
      </Link>

      {/* Main section */}
      <Image
        priority={true}
        src="/images/videoCall.svg"
        alt="Video Call Illustration"
        width={300}
        height={150}
      />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-1 mb-2 text-5xl font-bold text-blue-600"
      >
        BlinkVC
      </motion.h1>

      <h6 className="mb-6 text-md max-w-md text-center text-neutral-500 opacity-70">
        A place to video chat with random people, or sign up to start chatting
        with your friends.
      </h6>

      <Link
        href="/random"
        className="text-blue-500 bg-blue-500/20 px-6 py-3 rounded-md"
      >
        Random VC
      </Link>
    </motion.div>
  );
}
