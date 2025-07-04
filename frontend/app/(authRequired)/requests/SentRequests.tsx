import PeopleCard, { NoPeople } from "@/components/PeopleCard";
import StickyTitle from "@/components/StickyTitle";
import { MdArrowBack } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { userArrayElement } from "./page";

const SentRequests = ({
  user,
  unsendReq,
  setSentReqPage,
}: {
  user: any;
  unsendReq: (id: String) => void;
  setSentReqPage: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <section
    className="flex-1 h-screen w-full overflow-y-scroll pb-28
    sm:block"
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
);

export default SentRequests;
