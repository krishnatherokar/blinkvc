import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  user.missed_calls = [];
  await user.save();

  return new Response("Missed calls cleared", { status: 200 });
}
