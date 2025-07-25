import PeopleCard, { NoPeople } from "@/components/PeopleCard";
import StickyTitle from "@/components/StickyTitle";
import { LuVideo } from "react-icons/lu";
import { userArrayElement } from "../requests/page";
import { SkeletonCard } from "@/components/Loading";

const MissedCalls = ({
  user,
  loading,
  callPeer,
  clearMissedCalls,
}: {
  user: any;
  loading: boolean;
  callPeer: (user: userArrayElement) => void;
  clearMissedCalls: () => void;
}) => {
  return (
    <section
      className="flex-1 h-screen w-full overflow-y-scroll pb-28 border-neutral-200
      sm:block sm:border-r-1
      dark:border-neutral-800"
    >
      <StickyTitle>
        Missed Calls
        <span className="float-start">&emsp;&emsp;&nbsp;</span>
        <button
          className="float-end font-normal text-red-500 text-sm py-1"
          onClick={clearMissedCalls}
        >
          Clear All
        </button>
      </StickyTitle>
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : user.missed_calls.length ? (
        <>
          {user.missed_calls.map((element: userArrayElement, idx: number) => (
            <PeopleCard key={idx} username={element.username}>
              <LuVideo
                className="ml-3 h-6 w-6 float-end"
                onClick={() => callPeer(element)}
              />
            </PeopleCard>
          ))}
        </>
      ) : (
        <NoPeople>No Missed Calls</NoPeople>
      )}
    </section>
  );
};

export default MissedCalls;
