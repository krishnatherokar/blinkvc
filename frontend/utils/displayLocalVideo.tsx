export const displayVideo = async (
  remotevideoRef: React.RefObject<HTMLVideoElement | null>,
  localStreamRef: React.RefObject<MediaStream | null>
) => {
  localStreamRef.current?.getTracks().forEach((track) => track.stop());

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
