export const displayVideo = async (
  localvide: React.RefObject<HTMLVideoElement | null>,
  waitingStreamRef: React.RefObject<MediaStream | null>
) => {
  const stream = waitingStreamRef.current ?? await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  waitingStreamRef.current = stream;
  if (localvide.current) {
    localvide.current.muted = true;
    localvide.current.srcObject = stream;
  }
};
