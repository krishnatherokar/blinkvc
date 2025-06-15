"use client";
import { useEffect, useRef, useState } from "react";
import handleWebSocket from "@/utils/handleWebSocket";

export default function Home() {
  const localvideoRef = useRef<HTMLVideoElement | null>(null);
  const remotevideoRef = useRef<HTMLVideoElement | null>(null);
  const peerconnection = useRef<RTCPeerConnection | null>(null);
  const [data, setData] = useState("Loading...");
  useEffect(() => {
    handleWebSocket({ setData, localvideoRef, remotevideoRef, peerconnection });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-blue-600">BlinkVC</h1>
      <p className="mt-4 text-lg text-gray-700">{data}</p>
      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
        <video
          ref={localvideoRef}
          autoPlay
          playsInline
          muted
          className="m-4 w-full max-w-md rounded-lg"
        />
        <video
          ref={remotevideoRef}
          autoPlay
          playsInline
          className="m-4 w-full max-w-md rounded-lg"
        />
      </section>
    </main>
  );
}
