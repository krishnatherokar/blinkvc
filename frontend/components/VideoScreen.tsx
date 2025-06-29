"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { LuVideo, LuVideoOff } from "react-icons/lu";
import { MdOutlineCallEnd } from "react-icons/md";
import { RxReload, RxSpeakerLoud, RxSpeakerOff } from "react-icons/rx";

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

  const reload = () => {
    setIsAudioOn(true);
    setIsVideoOn(true);
    setIsMuted(false);
    setIsVideoSwapped(false);
    if (setCount) setCount((count: number) => count + 1);
  };

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
      {/* Background video */}
      <video
        ref={remotevideoRef}
        autoPlay
        playsInline
        className="fixed z-6 top-0 left-0 bg-white dark:bg-black w-screen h-screen object-cover"
      />

      {/* Top section */}

      <section
        className={`fixed z-8 top-0 left-0 w-screen flex ${
          data == "connected" ? "bg-none" : "bg-neutral-100 dark:bg-neutral-900"
        }  sm:bg-transparent`}
      >
        <video
          onClick={() => swapVideo()}
          ref={localvideoRef}
          autoPlay
          playsInline
          className={`${
            data == "connected" ? "" : "hidden"
          } max-w-1/2 min-w-1/2 max-h-80 sm:max-w-xs sm:min-w-3xs object-contain rounded-br-2xl`}
        />

        <section
          className={`flex-1 ${
            data == "connected" ? "hidden" : ""
          } sm:hidden flex items-center justify-center text-xl font-bold text-blue-600`}
        >
          BlinkVC
        </section>

        {/* Dummy transparent section */}

        <section className="flex-0 sm:flex-1 sm:min-w-20 md:max-w-none"></section>

        <section className="flex-1 max-w-xs md:min-w-xs">
          <section className="bg-neutral-100 dark:bg-neutral-900 flex justify-evenly w-full rounded-bl-2xl p-4 text-2xl">
            <button onClick={toggleVideo}>
              {isVideoOn ? <LuVideo /> : <LuVideoOff />}
            </button>
            <button onClick={toggleAudio}>
              {isAudioOn ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
            </button>
            <button onClick={toggleMute}>
              {isMuted ? <RxSpeakerOff /> : <RxSpeakerLoud />}
            </button>
          </section>
        </section>
      </section>

      {/* Bottom section */}

      <section className="fixed z-8 bottom-0 right-0 w-screen sm:w-sm rounded-t-2xl sm:rounded-tr-none bg-neutral-100 dark:bg-neutral-900 text-lg p-4 text-center">
        {data == "connected" ? <>Chatbox (in future updates)</> : data}
      </section>

      {/* Refresh and end call buttons */}

      {setCount ? (
        <button
          onClick={reload}
          className="fixed z-7 bottom-20 right-2 p-3 rounded-xl text-white bg-blue-700 text-2xl"
        >
          <RxReload />
        </button>
      ) : (
        <button
          onClick={() => router.back()}
          className="fixed z-7 bottom-20 right-2 p-3 rounded-xl text-white bg-red-500 text-2xl"
        >
          <MdOutlineCallEnd />
        </button>
      )}
    </main>
  );
};
export default VideoScreen;
