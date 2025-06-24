"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useRouter } from "next/navigation";
type messageType = {
  callerId?: string;
  toastType?: string;
  text: string;
};

const Toast = ({
  message,
  setMessage,
}: {
  message: messageType | null;
  setMessage: (message: messageType | null) => void;
}) => {
  const { triggerToast } = useToast();
  const router = useRouter();
  const callPeer = (callerId: String | undefined) => {
    triggerToast({ toastType: "info", text: "Accepting call..." });
    router.push(`/call?type=accept-call&targetId=${callerId}`);
  };
  return (
    <>
      {message?.callerId && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-10">
          {message.text}
          <button
            className="px-4 py-2 mx-1 rounded-md bg-blue-500"
            onClick={() => callPeer(message.callerId)}
          >
            Accept
          </button>
          <button
            className="px-4 py-2 mx-1 rounded-md bg-red-500"
            onClick={() => setMessage(null)}
          >
            Reject
          </button>
        </div>
      )}
      {message?.toastType && (
        <div
          onClick={() => setMessage(null)}
          className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-10"
        >
          {message.text}
        </div>
      )}
    </>
  );
};
export default Toast;
