import PeopleCard, { NoPeople } from "@/components/PeopleCard";
import StickyTitle from "@/components/StickyTitle";
import { MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { userArrayElement } from "./page";

const ReceivedRequests = ({
  user,
  sendReq,
  setSentReqPage,
  acceptReq,
  rejectReq,
}: {
  user: any;
  sendReq: (targetUsername: string) => void;
  setSentReqPage: React.Dispatch<React.SetStateAction<boolean>>;
  acceptReq: (id: String) => void;
  rejectReq: (id: String) => void;
}) => (
  <section
    className="flex-1 flex flex-col h-screen w-full pb-28
    overflow-y-scroll border-neutral-200
    sm:border-r-1
    dark:border-neutral-800"
  >
    <div className="min-h-60 flex-1 flex flex-col justify-center">
      <div className="text-center w-full p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const value = (form[0] as HTMLInputElement).value.toLowerCase();
            sendReq(value);
          }}
        >
          <input
            className="rounded-md p-2 bg-neutral-100 w-full max-w-80
            dark:bg-neutral-900"
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
);
export default ReceivedRequests;
