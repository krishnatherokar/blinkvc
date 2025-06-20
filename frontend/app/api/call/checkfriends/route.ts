import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const idA = searchParams.get("idA");
  const idB = searchParams.get("idB");

  if (!idA || !idB) {
    return new Response("Missing Params", { status: 400 });
  }

  await connectDB();

  const userA = await User.findOne({ clerkId: idA });
  const userB = await User.findOne({ clerkId: idB });

  if (!userA || !userB) {
    return new Response("One or both of the users were not found.", {
      status: 404,
    });
  }

  if (userA.friends.includes(userB._id) && userB.friends.includes(userA._id)) {
    return new Response("friends", { status: 200 });
  }

  return new Response("not-friends", { status: 401 });
}
