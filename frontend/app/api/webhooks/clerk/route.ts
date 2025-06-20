import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const username = "username" in evt.data ? evt.data.username : null;

    await connectDB();

    switch (evt.type) {
      case "user.created":
        await User.create({
          clerkId: id,
          username,
        });
        break;
      case "user.updated":
        await User.updateOne({ clerkId: id }, { username }, { upsert: true });
        // upsert ensures that if user is not created already, it will create one
        break;
      case "user.deleted":
        await User.deleteOne({ clerkId: id });
        break;
      default:
        console.log("Unhandled event:", evt.type);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
