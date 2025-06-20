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

  const caller = await User.findOne({ clerkId: userId });
  const targetUser = await User.findOne({ clerkId: targetId });

  if (!caller || !targetUser) {
    return new Response("User not found", { status: 404 });
  }

  targetUser.missed_calls.push(caller._id);
  await targetUser.save();

  return new Response("Missed call recorded", { status: 200 });
}
