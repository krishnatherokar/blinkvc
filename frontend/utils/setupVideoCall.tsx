export const setupVideoCall = async (
  ws: WebSocket,
  peerconnection: React.RefObject<RTCPeerConnection | null>,
  localvideoRef: React.RefObject<HTMLVideoElement | null>,
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.RefObject<MediaStream | null>,
  role: "caller" | "callee"
) => {
  peerconnection.current = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  localStreamRef.current?.getTracks().forEach((track) => track.stop());
  // stop the local stream if already playing

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localStreamRef.current = localStream;

  localStream.getTracks().forEach((track) => {
    peerconnection.current?.addTrack(track, localStream);
  });

  if (localvideoRef.current) {
    localvideoRef.current.muted = true;
    localvideoRef.current.srcObject = localStream;
  }

  peerconnection.current.ontrack = (event) => {
    if (remotevideoRef.current) {
      remotevideoRef.current.muted = false;
      remotevideoRef.current.srcObject = event.streams[0];
    }
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

  if (role === "caller") {
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

export const endVideoCall = (
  localStreamRef: React.RefObject<MediaStream | null>,
  localvideoRef: React.RefObject<HTMLVideoElement | null>,
  remotevideoRef: React.RefObject<HTMLVideoElement | null>
) => {
  localStreamRef.current?.getTracks().forEach((track) => track.stop());
  localStreamRef.current = null;
  if (localvideoRef.current) localvideoRef.current.srcObject = null;
  if (remotevideoRef.current) remotevideoRef.current.srcObject = null;
};
