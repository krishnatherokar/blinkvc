"use client";
import { useEffect, useRef, useState } from "react";
import handleWebSocket from "@/utils/handleWebSocket";
import { endVideoCall } from "@/utils/setupVideoCall";
import { useWSContext } from "@/contexts/WSContext";
import { askMediaAccess } from "@/utils/askMediaAccess";
import VideoScreen from "@/components/VideoScreen";

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

    if (ws?.readyState != WebSocket.OPEN) return;
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
  }, [count, ws?.readyState, mediaAccess]);

  const screenProps = {
    data,
    localvideoRef,
    remotevideoRef,
    setCount,
  };

  return <VideoScreen {...screenProps} />;
}
