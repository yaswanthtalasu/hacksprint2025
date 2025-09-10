import { Schema, model, Document } from "mongoose";

export interface IAuditLog extends Document {
  user?: Schema.Types.ObjectId;
  action: string;
  ip?: string;
  meta?: any;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    ip: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default model<IAuditLog>("AuditLog", AuditLogSchema);
