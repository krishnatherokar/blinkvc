"use client";
import Loading from "@/components/Loading";
import PeopleCard, { NoPeople } from "@/components/PeopleCard";
import StickyTitle from "@/components/StickyTitle";
import { useToast } from "@/contexts/GlobalToastContext";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useRef, useState } from "react";
import { MdArrowBack, MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

type userArrayElement = { clerkId: String; username: String };

const page = () => {
  const [sentReqPage, setSentReqPage] = useState(false);
  const { user, loading, refreshUser } = useUserContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { triggerToast, errorToast, confirm } = useToast();

  const sendReq = async () => {
    try {
      if (!inputRef.current) return;

      let targetUsername = inputRef.current.value.toLowerCase();
      inputRef.current.value = "";

      triggerToast({
        toastType: "info",
        text: `Sending friend request to @${targetUsername}`,
      });
      await axios.post("/api/user/sendreq", {
        targetUsername,
      });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request sent!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const unsendReq = async (targetId: String) => {
    try {
      const userChoice = await confirm({
        text: "Are you sure you want to unsend the request",
        confirmText: "Unsend",
        isRisky: true,
      });

      if (!userChoice) return;

      triggerToast({
        toastType: "info",
        text: "Unsending request...",
      });
      await axios.post("/api/user/unsendreq", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request unsent!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const rejectReq = async (targetId: String) => {
    try {
      const userChoice = await confirm({
        text: "Are you sure you want to reject the request",
        confirmText: "Reject",
        isRisky: true,
      });

      if (!userChoice) return;

      triggerToast({
        toastType: "info",
        text: "Rejecting request...",
      });
      await axios.post("/api/user/rejectreq", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request rejected!" });
    } catch (err) {
      errorToast(err);
    }
  };

  const acceptReq = async (targetId: String) => {
    try {
      triggerToast({
        toastType: "info",
        text: "Accepting request...",
      });
      await axios.post("/api/user/acceptreq", { targetId });

      refreshUser();
      triggerToast({ toastType: "success", text: "Request accepted!" });
    } catch (err) {
      errorToast(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="flex">
      {/* Request form and Received requests section */}
      <section
        className={`${
          sentReqPage ? "hidden" : "flex"
        } flex-1 flex-col h-screen w-full pb-28
        overflow-y-scroll border-neutral-200
        sm:flex sm:border-r-1 
        dark:border-neutral-800`}
      >
        <div className="min-h-60 flex-1 flex flex-col justify-center">
          <div className="text-center w-full p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendReq();
              }}
            >
              <input
                className="rounded-md p-2 bg-neutral-100 w-full max-w-80
                dark:bg-neutral-900"
                ref={inputRef}
                type="text"
                maxLength={20}
                placeholder="Username"
                required
              />
              <br />
              <button
                className="px-4 py-2 my-2 rounded-md text-white bg-blue-500 w-full max-w-80"
                type="submit"
              >
                Send Request
              </button>
            </form>
            <button
              className="px-4 py-2 my-2 text-blue-500 w-full max-w-80
              sm:hidden"
              onClick={() => setSentReqPage(true)}
            >
              Show Sent Requests
            </button>
          </div>
        </div>

        {/* Received requests section */}

        <section className="flex-1">
          <StickyTitle>Requests Received</StickyTitle>
          {user.requests.length ? (
            <>
              {user.requests.map((element: userArrayElement, idx: number) => (
                <PeopleCard key={idx} username={element.username}>
                  <RxCross2
                    className="ml-3 h-6 w-6 text-red-500 fill-red-500 float-end"
                    onClick={() => rejectReq(element.clerkId)}
                  />
                  <MdCheck
                    className="ml-3 h-6 w-6 float-end"
                    onClick={() => acceptReq(element.clerkId)}
                  />
                </PeopleCard>
              ))}
            </>
          ) : (
            <NoPeople>No Requests</NoPeople>
          )}
        </section>
      </section>

      {/* Sent requests section */}
      <section
        className={`${
          sentReqPage ? "block" : "hidden"
        } flex-1 h-screen w-full overflow-y-scroll pb-28
        sm:block`}
      >
        <StickyTitle>
          <MdArrowBack
            className="h-6 w-6 float-start font-light fill-blue-500
            sm:hidden"
            onClick={() => setSentReqPage(false)}
          />
          Requests Sent<span className="sm:hidden float-end">&emsp;</span>
        </StickyTitle>
        {user.req_sent.length ? (
          <>
            {user.req_sent.map((element: userArrayElement, idx: number) => (
              <PeopleCard key={idx} username={element.username}>
                <RxCross2
                  className="ml-3 h-6 w-6 text-red-500 fill-red-500 float-end"
                  onClick={() => unsendReq(element.clerkId)}
                />
              </PeopleCard>
            ))}
          </>
        ) : (
          <NoPeople>No Requests</NoPeople>
        )}
      </section>
    </section>
  );
};
export default page;
