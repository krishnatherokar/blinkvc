"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import handleWebSocket from "@/utils/handleWebSocket";
import { endVideoCall } from "@/utils/setupVideoCall";
import { useWSContext } from "@/contexts/WSContext";
import { askMediaAccess } from "@/utils/askMediaAccess";
import VideoScreen, { chatType } from "@/components/VideoScreen";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { displayVideo } from "@/utils/displayLocalVideo";
import CallLayout from "./CallLayout";

function Main() {
  const localvideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const waitingStreamRef = useRef<MediaStream | null>(null);
  const remotevideoRef = useRef<HTMLVideoElement | null>(null);
  const peerconnection = useRef<RTCPeerConnection | null>(null);
  const [data, setData] = useState("Loading...");
  const [mediaAccess, setMediaAccess] = useState(false);
  const [chat, setChat] = useState<chatType[] | null>(null);

  const { ws } = useWSContext();

  const params = useSearchParams();
  const type = params.get("type");
  const targetId = params.get("targetId");

  useEffect(() => {
    if (!type || !targetId) return;

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

    ws.send(JSON.stringify({ type, targetId }));
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
  }, [ws?.readyState, mediaAccess, type, targetId]);

  useEffect(() => {
    const sendMissedCall = async (targetId: string | null) => {
      await axios.post("/api/call/sendmissedcall", { targetId });
    };

    if (data == "Unanswered") sendMissedCall(params.get("targetId"));
  }, [data]);

  const screenProps = {
    data,
    localStreamRef,
    localvideoRef,
    remotevideoRef,
    chat,
    setChat,
    ws,
  };

  return type && targetId ? <VideoScreen {...screenProps} /> : <CallLayout />;
}

export default function Page() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}
