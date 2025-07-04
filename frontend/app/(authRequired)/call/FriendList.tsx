import PeopleCard, { NoPeople } from "@/components/PeopleCard";
import StickyTitle from "@/components/StickyTitle";
import { LuVideo } from "react-icons/lu";
import { userArrayElement } from "../requests/page";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";

const FriendsList = ({
  setNewCallScreen,
  callPeer,
  unFriend,
  user,
}: {
  setNewCallScreen: Dispatch<SetStateAction<boolean>>;
  callPeer: (user: userArrayElement) => void;
  unFriend: (user: userArrayElement) => void;
  user: any;
}) => {
  const router = useRouter();
  return (
    <section
      className="flex-1 h-screen w-full overflow-y-scroll pb-28
      sm:block"
    >
      <StickyTitle>
        <MdArrowBack
          className="h-6 w-6 float-start font-light fill-blue-500
          sm:hidden"
          onClick={() => setNewCallScreen(false)}
        />
        Friends
        <span className="float-end sm:hidden">&emsp;</span>
      </StickyTitle>
      {user.friends.length ? (
        <>
          {user.friends.map((element: userArrayElement, idx: number) => (
            <PeopleCard key={idx} username={element.username}>
              <LuVideo
                className="ml-3 h-6 w-6 float-end"
                onClick={() => callPeer(element)}
              />

              <AiOutlineUserDelete
                className="h-6 w-6 ml-3 float-end fill-red-500"
                onClick={() => unFriend(element)}
              />
            </PeopleCard>
          ))}
        </>
      ) : (
        <NoPeople>
          <div className="flex justify-center">
            No Friends
            <AiOutlineUserAdd
              className="h-6 w-6 fill-blue-500 ml-2"
              onClick={() => router.push("/requests")}
            />
          </div>
        </NoPeople>
      )}
    </section>
  );
};

export default FriendsList;
