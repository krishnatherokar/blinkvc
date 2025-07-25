"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { LuDot, LuVideo, LuVideoOff } from "react-icons/lu";
import { MdOutlineCallEnd, MdOutlineSend } from "react-icons/md";
import { RxReload, RxSpeakerLoud, RxSpeakerOff } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";

export type chatType = { sender: string; text: string };

const VideoScreen = ({
  data,
  localStreamRef,
  localvideoRef,
  remotevideoRef,
  chat,
  setChat,
  ws,
  setCount,
}: {
  data: string;
  localStreamRef: React.RefObject<MediaStream | null>;
  localvideoRef: React.RefObject<HTMLVideoElement | null>;
  remotevideoRef: React.RefObject<HTMLVideoElement | null>;
  chat: chatType[] | null;
  setChat: React.Dispatch<React.SetStateAction<chatType[] | null>>;
  ws: WebSocket | null;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoSwapped, setIsVideoSwapped] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    return () => {
      setChat(null);
    };
  }, []);

  const reload = () => {
    setIsAudioOn(true);
    setIsVideoOn(true);
    setIsMuted(false);
    setIsVideoSwapped(false);
    setIsChatVisible(false);
    setChat(null);
    if (setCount) setCount((count: number) => count + 1);
  };

  const sendMessage = () => {
    if (!chatInputRef.current) return;
    let text = chatInputRef.current.value;
    chatInputRef.current.value = "";

    if (ws) ws.send(JSON.stringify({ type: "chat", text }));
    setChat((prev) =>
      prev ? [...prev, { sender: "You", text }] : [{ sender: "You", text }]
    );
  };

  const swapVideo = () => {
    if (localvideoRef.current && remotevideoRef.current) {
      localvideoRef.current.muted = isVideoSwapped || isMuted;
      remotevideoRef.current.muted = !isVideoSwapped || isMuted;
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isChatVisible]);

  useEffect(() => {
    if (data == "Peer disconnected") setIsChatVisible(false);
  }, [data]);

  return (
    <main className="h-screen w-screen">
      {/* Background video */}
      <video
        ref={remotevideoRef}
        onClick={() => setIsChatVisible(false)}
        autoPlay
        playsInline
        className="fixed z-6 top-0 left-0 bg-white w-screen h-screen object-cover transform scale-x-[-1]
        dark:bg-black"
      />

      {/* Top section */}

      <section
        className="fixed z-8 top-0 left-0 w-screen flex
        sm:bg-transparent"
      >
        <motion.div
          layout
          className={data == "connected" ? "h-fit w-fit" : "fixed inset-0 z-7"}
          transition={{ duration: 0.1 }}
        >
          <video
            onClick={() => swapVideo()}
            ref={localvideoRef}
            autoPlay
            playsInline
            className={`${
              data == "connected"
                ? "rounded-bl-2xl max-w-50 max-h-50 object-contain sm:max-w-xs"
                : "fixed z-7 top-0 left-0 h-screen w-screen object-cover"
            } transform scale-x-[-1]`}
          />
        </motion.div>

        {/* Dummy transparent section */}
        <section
          className={`${data == "connected" ? "flex-0 md:flex-1" : "flex-1"}`}
        ></section>

        {/* Control buttons section */}
        <AnimatePresence>
          {data == "connected" && (
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-1 z-8 transition duration-200
              md:max-w-xs md:min-w-2xs"
            >
              <section
                className="bg-neutral-100 flex justify-evenly w-full rounded-bl-2xl py-4 text-2xl
                dark:bg-neutral-900"
              >
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
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Bottom section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isChatVisible ? 1 : 0}
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed z-9 bottom-0 right-0 w-screen text-lg bg-neutral-100 rounded-t-2xl
          sm:w-sm sm:rounded-tr-none
          dark:bg-neutral-900"
        >
          {isChatVisible ? (
            <>
              {/* Chat window */}
              <div
                className="h-40 overflow-y-scroll rounded-xl mx-2 mt-2 py-1 bg-white
                dark:bg-black"
              >
                {chat ? (
                  <>
                    {chat.map((message: chatType, i: number) => (
                      <div
                        key={i}
                        className={`${
                          message.sender == "You"
                            ? "ml-auto rounded-br-none bg-neutral-100 dark:bg-neutral-900"
                            : "mr-auto rounded-bl-none text-white bg-blue-600"
                        } w-fit max-w-4/5 px-3 py-2 m-2 rounded-xl`}
                      >
                        {message.text}
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </>
                ) : (
                  <div
                    className="flex flex-col h-full text-center justify-center text-neutral-300 p-4
              dark:text-neutral-700"
                  >
                    No messages
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="w-full flex"
              >
                <input
                  ref={chatInputRef}
                  type="text"
                  maxLength={60}
                  placeholder="Type here..."
                  className="flex-1 rounded-sm p-2 m-2 bg-white
                  dark:bg-black"
                  autoComplete="off"
                  required
                  autoFocus
                />
                <button type="submit">
                  <MdOutlineSend className="h-7 w-7 m-2" />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Bottom info section */}
              {data == "connected" ? (
                <div
                  className="p-4 text-center"
                  onClick={() => setIsChatVisible(true)}
                >
                  {chat ? (
                    <>
                      {chat[chat.length - 1].text}
                      <LuDot className="h-6 w-6 inline" />
                    </>
                  ) : null}
                  <span className="text-blue-600">Tap to Chat</span>
                </div>
              ) : (
                <div className="p-4 text-center">{data}</div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Refresh and end call buttons */}

      {setCount ? (
        <button
          onClick={reload}
          className="fixed z-8 bottom-20 right-2 p-4 rounded-2xl text-white bg-blue-600"
        >
          <RxReload className="h-8 w-8" />
        </button>
      ) : (
        <button
          onClick={() => router.back()}
          className="fixed z-8 bottom-20 right-2 p-4 rounded-2xl text-white bg-red-500"
        >
          <MdOutlineCallEnd className="h-8 w-8" />
        </button>
      )}
    </main>
  );
};
export default VideoScreen;
