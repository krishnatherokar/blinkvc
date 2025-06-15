import { useRef } from "react";

const setupVideoCall = async ({
  data,
  ws,
  peerconnection,
  localvideoRef,
  remotevideoRef,
}: {
  data: any;
  ws: WebSocket;
  peerconnection: React.RefObject<RTCPeerConnection | null>;
  localvideoRef: React.RefObject<HTMLVideoElement | null>;
  remotevideoRef: React.RefObject<HTMLVideoElement | null>;
}) => {
  peerconnection.current = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localStream.getTracks().forEach((track) => {
    peerconnection.current?.addTrack(track, localStream);
  });

  if (localvideoRef.current) localvideoRef.current.srcObject = localStream;

  peerconnection.current.ontrack = (event) => {
    if (remotevideoRef.current)
      remotevideoRef.current.srcObject = event.streams[0];
  };

  peerconnection.current.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(
        JSON.stringify({
          type: "candidate",
          candidate: event.candidate,
        })
      );
    }
  };

  if (data.role === "caller") {
    const offer = await peerconnection.current.createOffer();
    await peerconnection.current.setLocalDescription(offer);
    ws.send(
      JSON.stringify({
        type: "offer",
        offer,
      })
    );
  }
};

export default setupVideoCall;
