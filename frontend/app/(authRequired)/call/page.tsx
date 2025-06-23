"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import handleWebSocket from "@/utils/handleWebSocket";
import { endVideoCall } from "@/utils/setupVideoCall";
import { useWSContext } from "@/contexts/WSContext";
import { askMediaAccess } from "@/utils/askMediaAccess";
import VideoScreen from "@/components/VideoScreen";
import { useSearchParams } from "next/navigation";

function Main() {
  const localvideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remotevideoRef = useRef<HTMLVideoElement | null>(null);
  const peerconnection = useRef<RTCPeerConnection | null>(null);
  const [data, setData] = useState("Loading...");
  const [mediaAccess, setMediaAccess] = useState(false);
  const { ws } = useWSContext();

  const params = useSearchParams();

  useEffect(() => {
    askMediaAccess(setMediaAccess);

    if (ws?.readyState != WebSocket.OPEN || !params) return;
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

    const type = params.get("type");
    const targetId = params.get("targetId");

    ws.send(JSON.stringify({ type, targetId }));
    ws.addEventListener("message", handleMessages);

    return () => {
      ws.removeEventListener("message", handleMessages);
      ws.send(JSON.stringify({ type: "end-call" }));
      endVideoCall(localStreamRef, localvideoRef, remotevideoRef);
    };
  }, [ws?.readyState, mediaAccess, params]);

  const screenProps = {
    data,
    localvideoRef,
    remotevideoRef,
  };

  return <VideoScreen {...screenProps} />;
}

export default function Page() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}
