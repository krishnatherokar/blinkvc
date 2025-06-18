export const askMediaAccess = async (
  setMediaAccess: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((t) => t.stop());
    setMediaAccess(true);
  } catch (err) {
    setMediaAccess(false);
  }
};
