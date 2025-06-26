"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const VideoScreen = ({
  data,
  localStreamRef,
  localvideoRef,
  remotevideoRef,
  setCount,
}: {
  data: string;
  localStreamRef: React.RefObject<MediaStream | null>;
  localvideoRef: React.RefObject<HTMLVideoElement | null>;
  remotevideoRef: React.RefObject<HTMLVideoElement | null>;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoSwapped, setIsVideoSwapped] = useState(false);

  const router = useRouter();
  const swapVideo = () => {
    if (localvideoRef.current && remotevideoRef.current) {
      localvideoRef.current.muted = isVideoSwapped;
      remotevideoRef.current.muted = !isVideoSwapped;
      setIsVideoSwapped((prev) => !prev);

      let localSrc = localvideoRef.current.srcObject;
      localvideoRef.current.srcObject = remotevideoRef.current.srcObject;
      remotevideoRef.current.srcObject = localSrc;
    }
  };

  const toggleMute = () => {
    if (!localvideoRef.current || !remotevideoRef.current) return;

    if (isVideoSwapped) {
      localvideoRef.current.muted = !isMuted;
    } else remotevideoRef.current.muted = !isMuted;
    setIsMuted((prev) => !prev);
  };

  const toggleAudio = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsAudioOn((prev) => !prev);
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOn((prev) => !prev);
  };

  return (
    <main>
      <video
        ref={remotevideoRef}
        autoPlay
        playsInline
        className="fixed z-6 top-0 left-0 bg-black w-screen h-screen object-cover"
      />

      <section
        className={`fixed z-8 top-0 left-0 w-screen flex ${
          data == "connected" ? "bg-none" : "bg-neutral-900"
        }  sm:bg-transparent`}
      >
        {data == "connected" && (
          <video
            onClick={() => swapVideo()}
            ref={localvideoRef}
            autoPlay
            playsInline
            className="max-w-1/2 max-h-80 sm:max-w-xs object-contain rounded-br-2xl"
          />
        )}

        <section
          className={`flex-1 ${
            data == "connected" ? "hidden" : ""
          } sm:hidden flex items-center justify-center text-xl font-bold text-blue-600`}
        >
          BlinkVC
        </section>

        <section className="flex-0 sm:flex-1 sm:min-w-20 md:max-w-none"></section>

        <section className="flex-1 max-w-xs md:min-w-xs">
          <section className="bg-neutral-900 flex justify-evenly w-full rounded-bl-2xl p-4">
            <button onClick={toggleVideo}>
              {isVideoOn ? <>V off</> : <>V on</>}
            </button>
            <button onClick={toggleAudio}>
              {isAudioOn ? <>A off</> : <>A on</>}
            </button>
            <button onClick={toggleMute}>
              {isMuted ? <>Unmute</> : <>Mute</>}
            </button>
          </section>
        </section>
      </section>

      <section className="fixed flex z-8 bottom-0 right-0 w-screen sm:w-sm rounded-t-2xl sm:rounded-tr-none bg-neutral-900">
        {data == "connected" ? (
          <div className="flex-1 flex items-center justify-center text-lg">
            Chatbox (in future updates)
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-lg">
            {data}
          </div>
        )}

        {setCount ? (
          <button
            onClick={() => setCount((count: number) => count + 1)}
            className="px-4 py-2 m-3 bg-blue-600 rounded-lg"
          >
            Refresh
          </button>
        ) : (
          <button
            onClick={() => router.back()}
            className="px-4 py-2 m-3 bg-red-500 rounded-lg"
          >
            End Call
          </button>
        )}
      </section>
    </main>
  );
};
export default VideoScreen;
