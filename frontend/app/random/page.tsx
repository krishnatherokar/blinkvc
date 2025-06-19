"use client";
import { useEffect, useRef, useState } from "react";
import handleWebSocket from "@/utils/handleWebSocket";
import { endVideoCall } from "@/utils/setupVideoCall";
import { useWSContext } from "@/contexts/WSContext";
import { askMediaAccess } from "@/utils/askMediaAccess";

export default function Home() {
  const localvideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remotevideoRef = useRef<HTMLVideoElement | null>(null);
  const peerconnection = useRef<RTCPeerConnection | null>(null);
  const [data, setData] = useState("Loading...");
  const [count, setCount] = useState(0);
  const [mediaAccess, setMediaAccess] = useState(false);
  const { ws } = useWSContext();

  useEffect(() => {
    askMediaAccess(setMediaAccess);

    if (!ws) return;
    if (!mediaAccess) {
      setData("Camera and Mic permission denied");
      return;
    } else setData("Loading...");

    const handleMessages = (event: MessageEvent) => {
      handleWebSocket(
        event,
        ws,
        setData,
        localvideoRef,
        localStreamRef,
        remotevideoRef,
        peerconnection
      );
    };

    ws.send(JSON.stringify({ type: "random-call" }));
    ws.addEventListener("message", handleMessages);

    return () => {
      ws.removeEventListener("message", handleMessages);
      ws.send(JSON.stringify({ type: "end-call" }));
      endVideoCall(localStreamRef, localvideoRef, remotevideoRef);
    };
  }, [count, ws, mediaAccess]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p className="mt-4 text-lg text-gray-700">{data}</p>

      <button
        onClick={() => setCount((count) => count + 1)}
        className="m-4 px-6 py-3 bg-blue-600 rounded-lg"
      >
        Refresh
      </button>

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
