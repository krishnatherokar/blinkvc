export const displayVideo = async (
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.RefObject<MediaStream | null>
) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localStreamRef.current = stream;
  if (remotevideoRef.current) {
    remotevideoRef.current.muted = true;
    remotevideoRef.current.srcObject = stream;
  }
};
