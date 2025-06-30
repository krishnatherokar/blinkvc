export const setupVideoCall = async (
  ws: WebSocket,
  peerconnection: React.RefObject<RTCPeerConnection | null>,
  localvideoRef: React.RefObject<HTMLVideoElement | null>,
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.RefObject<MediaStream | null>,
  trackReadyResolve: (() => void) | null
) => {
  peerconnection.current = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localStreamRef.current = localStream;

  localStream.getTracks().forEach((track) => {
    const alreadyAdded = peerconnection.current
      ?.getSenders()
      .some((sender) => sender.track === track);
    if (!alreadyAdded) {
      peerconnection.current?.addTrack(track, localStream);
      if (trackReadyResolve) trackReadyResolve();

      console.log("Local track added");
    }
  });

  if (localvideoRef.current) {
    localvideoRef.current.muted = true;
    localvideoRef.current.srcObject = localStream;
  }

  const remoteStream = new MediaStream();
  if (remotevideoRef.current) {
    remotevideoRef.current.muted = false;
    remotevideoRef.current.srcObject = remoteStream;
  }

  peerconnection.current.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
      console.log("Track received: ontrack");
    });
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

  peerconnection.current.onnegotiationneeded = async () => {
    if (peerconnection.current?.signalingState !== "stable") {
      console.warn(
        "Skipping negotiation due to state: ",
        peerconnection.current?.signalingState
      );
      return;
    }

    try {
      const offer = await peerconnection.current!.createOffer();
      await peerconnection.current!.setLocalDescription(offer);
      ws.send(JSON.stringify({ type: "offer", offer }));
    } catch (err) {
      console.error("Negotiation error:", err);
    }
  };
};

export const endVideoCall = (
  localStreamRef: React.RefObject<MediaStream | null>,
  localvideoRef: React.RefObject<HTMLVideoElement | null>,
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  waitingStreamRef?: React.RefObject<MediaStream | null>
) => {
  localStreamRef.current?.getTracks().forEach((track) => track.stop());
  localStreamRef.current = null;
  if (waitingStreamRef) {
    waitingStreamRef.current?.getTracks().forEach((track) => track.stop());
    waitingStreamRef.current = null;
  }
  if (localvideoRef.current) localvideoRef.current.srcObject = null;
  if (remotevideoRef.current) remotevideoRef.current.srcObject = null;
};
