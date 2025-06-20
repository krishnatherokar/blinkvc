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

  const requestIndex = user.requests.indexOf(targetUser._id);

  if (requestIndex !== -1) {
    // Remove request
    user.requests.splice(requestIndex, 1);

    // Add to friends
    user.friends.push(targetUser._id);
    targetUser.friends.push(user._id);

    // Remove from targetUser's sent requests
    const sentIndex = targetUser.req_sent.indexOf(user._id);
    if (sentIndex !== -1) {
      targetUser.req_sent.splice(sentIndex, 1);
    }

    await user.save();
    await targetUser.save();

    return new Response("Friend request accepted", { status: 200 });
  }

  return new Response("No friend request found", { status: 404 });
}
