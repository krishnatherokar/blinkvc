"use client";
import { useEffect, useRef, useState } from "react";
import handleWebSocket from "@/utils/handleWebSocket";
import { endVideoCall } from "@/utils/setupVideoCall";
import { useWSContext } from "@/contexts/WSContext";
import { askMediaAccess } from "@/utils/askMediaAccess";
import VideoScreen, { chatType } from "@/components/VideoScreen";
import { displayVideo } from "@/utils/displayLocalVideo";

export default function Home() {
  const localvideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const waitingStreamRef = useRef<MediaStream | null>(null);
  const remotevideoRef = useRef<HTMLVideoElement | null>(null);
  const peerconnection = useRef<RTCPeerConnection | null>(null);
  const [data, setData] = useState("Loading...");
  const [count, setCount] = useState(0);
  const [mediaAccess, setMediaAccess] = useState(false);
  const [chat, setChat] = useState<chatType[] | null>(null);


  const { ws } = useWSContext();

  useEffect(() => {
    askMediaAccess(setMediaAccess);

    if (!mediaAccess) {
      setData("Camera and Mic Inaccessible");
      return;
    } else setData("Loading...");

    displayVideo(remotevideoRef, waitingStreamRef);

    if (ws?.readyState != WebSocket.OPEN) return;

    const handleMessages = (event: MessageEvent) => {
      handleWebSocket(
        event,
        ws,
        setData,
        localvideoRef,
        localStreamRef,
        remotevideoRef,
        peerconnection,
        setChat
      );
    };

    ws.send(JSON.stringify({ type: "random-call" }));
    ws.addEventListener("message", handleMessages);

    return () => {
      ws.removeEventListener("message", handleMessages);
      ws.send(JSON.stringify({ type: "end-call" }));
      endVideoCall(
        localStreamRef,
        localvideoRef,
        remotevideoRef,
        waitingStreamRef
      );
    };
  }, [count, ws?.readyState, mediaAccess]);

  const screenProps = {
    data,
    localStreamRef,
    localvideoRef,
    remotevideoRef,
    chat,
    setChat,
    ws,
    setCount,
  };

  return <VideoScreen {...screenProps} />;
}
