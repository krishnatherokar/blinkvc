import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string;
  friends: Array<string>;
  requests: Array<string>;
  req_sent: Array<string>;
}

const UserSchema = new Schema<IUser>({
  clerkId: String,
  username: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  req_sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
