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
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p className="mt-4 text-lg text-gray-700">{data}</p>
      {setCount && (
        <button
          onClick={() => setCount((count: number) => count + 1)}
          className="m-4 px-6 py-3 bg-blue-600 rounded-lg"
        >
          Refresh
        </button>
      )}

      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
        <video
          ref={localvideoRef}
          autoPlay
          playsInline
          muted
          className="m-4 w-full max-w-md rounded-lg"
        />
        <video
          ref={remotevideoRef}
          autoPlay
          playsInline
          className="m-4 w-full max-w-md rounded-lg"
        />
      </section>
    </main>
  );
};
export default VideoScreen;
