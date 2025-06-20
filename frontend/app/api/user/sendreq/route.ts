import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { targetId } = await req.json();

  if (!userId || !targetId) {
    return new Response("Unauthorized or Missing Params", { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ clerkId: userId });
  const targetUser = await User.findOne({ clerkId: targetId });

  if (!user || !targetUser) {
    return new Response("User not found", { status: 404 });
  }

  // Check if already sent or already friends
  if (
    user.req_sent.includes(targetUser._id) ||
    user.friends.includes(targetUser._id)
  ) {
    return new Response("Request already sent or already friends", {
      status: 409,
    });
  }

  user.req_sent.push(targetUser._id);
  targetUser.requests.push(user._id);

  await user.save();
  await targetUser.save();

  return new Response("Friend request sent", { status: 200 });
}
