"use client";
import Link from "next/link";
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
  return (
    <>
      {message?.callerId && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-10">
          {message.text}
          <Link
            href={`/call?type=accept-call&targetId=${message.callerId}`}
            className="px-4 py-2 mx-1 rounded-md bg-blue-500"
          >
            Accept
          </Link>
          <button
            className="px-4 py-2 mx-1 rounded-md bg-red-500"
            onClick={() => setMessage(null)}
          >
            Reject
          </button>
        </div>
      )}
      {message?.toastType && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-10">
          {message.text}
        </div>
      )}
    </>
  );
};
export default Toast;
