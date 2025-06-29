import { chatType } from "@/components/VideoScreen";
import { endVideoCall, setupVideoCall } from "./setupVideoCall";

const handleWebSocket = async (
  event: MessageEvent,
  ws: WebSocket,
  setData: any,
  localvideoRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.RefObject<MediaStream | null>,
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  peerconnection: React.RefObject<RTCPeerConnection | null>,
  setChat: React.Dispatch<React.SetStateAction<chatType[] | null>>
) => {
  const text =
    event.data instanceof Blob ? await event.data.text() : event.data;
  const data = JSON.parse(text);

  switch (data.type) {
    case "waiting":
      setData("Server waiting for a peer...");
      break;

    case "call-response":
      setData(data.response);
      if (data.response == "Ringing") {
        setTimeout(() => {
          setData((data: String) => (data == "Ringing" ? "Unanswered" : data));
        }, 15000);
      }
      break;

    case "connected":
      setData("connected");
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
      setChat(null);
      endVideoCall(localStreamRef, localvideoRef, remotevideoRef);
      break;

    case "chat":
      setChat((prev) =>
        prev
          ? [...prev, { sender: "Peer", text: data.text }]
          : [{ sender: "Peer", text: data.text }]
      );
      break;

    default:
      setData("Unknown message from server");
  }
};

export default handleWebSocket;
