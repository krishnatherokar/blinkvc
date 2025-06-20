import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
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

  user.requests = user.requests.filter(
    (id: Types.ObjectId) => !id.equals(targetUser._id)
  );
  targetUser.req_sent = targetUser.req_sent.filter(
    (id: Types.ObjectId) => !id.equals(user._id)
  );

  await user.save();
  await targetUser.save();

  return new Response("Friend request rejected", { status: 200 });
}
