import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
MessageSchema.index({ chat: 1, createdAt: 1 }); // Oldest ones first then new ones
/**
 * 1: Ascending order (oldest to newest)
 * -1: Descending order (newest to oldest)
 */

export const Message = mongoose.model("Message", MessageSchema);
