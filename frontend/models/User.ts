import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string;
  friends: Types.ObjectId[];
  requests: Types.ObjectId[];
  req_sent: Types.ObjectId[];
  missed_calls: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  clerkId: String,
  username: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  req_sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  missed_calls: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
