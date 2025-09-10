import { Schema, model, Document } from "mongoose";

export type HealthRecordType =
  | "allergy"
  | "vital"
  | "prescription"
  | "visit"
  | "vaccination"
  | "other";

export interface IHealthRecord extends Document {
  owner: Schema.Types.ObjectId;
  type: HealthRecordType;
  title: string;
  notesEncrypted: string; // encrypted JSON string
  meta: any; // plain small metadata (non-sensitive)
  createdAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "allergy",
        "vital",
        "prescription",
        "visit",
        "vaccination",
        "other",
      ],
      required: true,
    },
    title: { type: String, required: true },
    notesEncrypted: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default model<IHealthRecord>("HealthRecord", HealthRecordSchema);
