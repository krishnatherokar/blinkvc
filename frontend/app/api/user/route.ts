import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ clerkId: userId })
    .populate("friends", "clerkId username")
    .populate("requests", "clerkId username")
    .populate("req_sent", "clerkId username")
    .populate("missed_calls", "clerkId username");

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return Response.json({
    friends: user.friends,
    requests: user.requests,
    req_sent: user.req_sent,
    missed_calls: user.missed_calls,
  });
}
