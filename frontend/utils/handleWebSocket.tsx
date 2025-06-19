import { endVideoCall, setupVideoCall } from "./setupVideoCall";

const handleWebSocket = async (
  event: MessageEvent,
  ws: WebSocket,
  setData: (message: string) => void,
  localvideoRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.RefObject<MediaStream | null>,
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  peerconnection: React.RefObject<RTCPeerConnection | null>
) => {
    const text =
      event.data instanceof Blob ? await event.data.text() : event.data;
    const data = JSON.parse(text);

    switch (data.type) {
      case "waiting":
        setData("Server waiting for a peer...");
        break;

      case "connected":
        setData("Connected to a peer!");
        setupVideoCall(
          ws,
          peerconnection,
          localvideoRef,
          remotevideoRef,
          localStreamRef,
          data.role
        );
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
        endVideoCall(localStreamRef, localvideoRef, remotevideoRef);
        break;

      default:
        setData(data.message || "Unknown message from server");
    }
};

export default handleWebSocket;
