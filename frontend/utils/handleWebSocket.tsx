import setupVideoCall from "./setupVideoCall";

type HandleWebSocketProps = {
  setData: (message: string) => void;
};

const handleWebSocket = ({
  setData,
  localvideoRef,
  remotevideoRef,
  peerconnection,
}: HandleWebSocketProps & {
  localvideoRef: React.RefObject<HTMLVideoElement | null>;
  remotevideoRef: React.RefObject<HTMLVideoElement | null>;
  peerconnection: React.RefObject<RTCPeerConnection | null>;
}): void => {
  const ws = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
  );

  ws.onmessage = async (event: MessageEvent) => {
    const text =
      event.data instanceof Blob ? await event.data.text() : event.data;
    const data = JSON.parse(text);

    switch (data.type) {
      case "waiting":
        setData("Server waiting for a peer...");
        break;

      case "connected":
        setData("Connected to a peer!");
        setupVideoCall({
          data,
          ws,
          peerconnection,
          localvideoRef,
          remotevideoRef,
        });
        break;

      case "candidate":
        peerconnection.current?.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        break;

      case "offer":
        await peerconnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

        const answer = await peerconnection.current?.createAnswer();
        peerconnection.current?.setLocalDescription(answer);
        ws.send(
          JSON.stringify({
            type: "answer",
            answer,
          })
        );
        break;

      case "answer":
        await peerconnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        break;

      case "disconnected":
        setData("Peer disconnected");
        if (localvideoRef.current) localvideoRef.current.srcObject = null;
        if (remotevideoRef.current) remotevideoRef.current.srcObject = null;
        ws.close();
        break;

      default:
        setData(data.message || "Unknown message from server");
    }
  };
};

export default handleWebSocket;
