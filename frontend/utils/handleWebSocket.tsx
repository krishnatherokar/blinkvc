import { chatType } from "@/components/VideoScreen";
import { endVideoCall, setupVideoCall } from "./setupVideoCall";

let trackReady: Promise<void>;
let trackReadyResolve: (() => void) | null;

const resetTrackReady = () => {
  trackReady = new Promise<void>((res) => (trackReadyResolve = res));
};

const candidateQueue: RTCIceCandidateInit[] = [];

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

  const flushCandidateQueue = async () => {
    for (const candidate of candidateQueue) {
      await peerconnection.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    }
    candidateQueue.length = 0;
  };

  switch (data.type) {
    case "waiting":
      setData("Server waiting for a peer...");
      break;

    case "call-response":
      setData(data.response);
      if (data.response == "Ringing") {
        setTimeout(() => {
          setData((data: String) => (data == "Ringing" ? "Unanswered" : data));
        }, 30000);
      }
      break;

    case "connected":
      resetTrackReady();
      setData("connected");
      setupVideoCall(
        ws,
        peerconnection,
        localvideoRef,
        remotevideoRef,
        localStreamRef,
        trackReady,
        trackReadyResolve
        // data.role
      );
      break;

    case "candidate":
      if (peerconnection.current?.remoteDescription) {
        try {
          await peerconnection.current?.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (err) {
          console.error("Failed to add ICE candidate:", err);
        }
      } else {
        candidateQueue.push(data.candidate);
      }
      break;

    case "offer":
      await trackReady;

      await peerconnection.current?.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      console.log("Remote description set");

      const answer = await peerconnection.current?.createAnswer();
      peerconnection.current?.setLocalDescription(answer);
      ws.send(
        JSON.stringify({
          type: "answer",
          answer,
        })
      );

      await flushCandidateQueue();
      break;

    case "answer":
      if (peerconnection.current?.signalingState != "have-local-offer") {
        console.warn(
          "Invalid signaling state:",
          peerconnection.current?.signalingState
        );
        break;
      }

      await peerconnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      await flushCandidateQueue();
      break;

    case "disconnected":
      setData("Peer disconnected");
      setChat(null);
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
