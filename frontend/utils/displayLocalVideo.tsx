export const displayVideo = async (
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  waitingStreamRef: React.RefObject<MediaStream | null>
) => {
  const stream = waitingStreamRef.current ?? await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  waitingStreamRef.current = stream;
  if (remotevideoRef.current) {
    remotevideoRef.current.muted = true;
    remotevideoRef.current.srcObject = stream;
  }
};
