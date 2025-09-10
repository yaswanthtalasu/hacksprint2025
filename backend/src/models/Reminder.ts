import { Schema, model, Document } from "mongoose";

export interface IReminder extends Document {
  owner: Schema.Types.ObjectId;
  title: string;
  message?: string;
  remindAt: Date;
  repeat?: "none" | "daily" | "weekly" | "monthly";
  done: boolean;
}

const ReminderSchema = new Schema<IReminder>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String },
    remindAt: { type: Date, required: true },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IReminder>("Reminder", ReminderSchema);
