"use client";
import { useRouter } from "next/navigation";

const VideoScreen = ({
  data,
  localvideoRef,
  remotevideoRef,
  setCount,
}: {
  data: string;
  localvideoRef: React.RefObject<HTMLVideoElement | null>;
  remotevideoRef: React.RefObject<HTMLVideoElement | null>;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const router = useRouter();
  const swapVideo = () => {
    if (localvideoRef.current && remotevideoRef.current) {
      localvideoRef.current.muted = !localvideoRef.current.muted;
      remotevideoRef.current.muted = !remotevideoRef.current.muted;

      let localSrc = localvideoRef.current.srcObject;
      localvideoRef.current.srcObject = remotevideoRef.current.srcObject;
      remotevideoRef.current.srcObject = localSrc;
    }
  };
  return (
    <main>
      {data == "connected" && (
        <video
          onClick={() => swapVideo()}
          ref={localvideoRef}
          autoPlay
          playsInline
          className="fixed z-8 top-0 left-0 w-40 h-60 md:w-md object-contain rounded-br-2xl bg-neutral-950"
        />
      )}
      <video
        ref={remotevideoRef}
        autoPlay
        playsInline
        className="fixed z-6 top-0 left-0 w-screen h-screen object-contain bg-neutral-950"
      />

      <section className="fixed flex z-8 bottom-0 right-0 w-screen md:w-lg md:rounded-tl-lg bg-neutral-800">
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
