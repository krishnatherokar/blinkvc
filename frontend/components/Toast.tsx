"use client";
import { useToast } from "@/contexts/GlobalToastContext";
import { useRouter } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
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
  setMessage: (message: messageType | null) => void | null;
}) => {
  const { triggerToast } = useToast();
  const router = useRouter();
  const callPeer = (callerId: String | undefined) => {
    triggerToast({ toastType: "info", text: "Accepting call..." });
    router.push(`/call?type=accept-call&targetId=${callerId}`);
  };

  const renderToast = (message: messageType) => {
    switch (message.toastType) {
      case "info":
        return (
          <div className="bg-blue-500/20 text-blue-500 p-5 rounded-xl flex justify-start">
            <AiOutlineLoading className="animate-spin h-6 w-6 mr-2" />
            {message.text}
          </div>
        );
      case "error":
        return (
          <div className="bg-red-500/20 text-red-500 p-5 rounded-xl flex justify-start">
            <RxCross2 className="h-6 w-6 mr-2" />
            {message.text}
          </div>
        );
      case "success":
        return (
          <div className="bg-green-500/20 text-green-500 p-5 rounded-xl flex justify-start">
            <MdCheck className="h-6 w-6 mr-2" />
            {message.text}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <>
      {message?.callerId && (
        <div className="fixed w-screen sm:w-120 top-0 right-0 z-10">
          <div className="bg-gray-800 text-white p-4 m-2 rounded-xl">
            <div className="pb-4 mx-1">{message.text}</div>
            <div className="flex w-full">
              <button
                className="flex-1 px-4 py-2 mx-1 rounded-md bg-blue-500"
                onClick={() => callPeer(message.callerId)}
              >
                Accept
              </button>
              <button
                className="flex-1 px-4 py-2 mx-1 rounded-md bg-red-500"
                onClick={() => setMessage(null)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {message?.toastType && (
        <div
          className="fixed w-screen sm:w-120 top-0 right-0 z-10"
          onClick={() => setMessage(null)}
        >
          <div className="bg-white dark:bg-black m-2 rounded-xl">
            {renderToast(message)}
          </div>
        </div>
      )}
    </>
  );
};
export default Toast;
