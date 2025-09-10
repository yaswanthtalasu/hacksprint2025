import { Request, Response } from "express";
import HealthRecord from "../models/HealthRecord";
import { encryptJSON, decryptJSON } from "../services/encryption";
import AuditLog from "../models/AuditLog";

export const createRecord = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { type, title, notes, meta } = req.body;
  const notesEncrypted = encryptJSON(notes || {});
  const record = await HealthRecord.create({
    owner: user._id,
    type,
    title,
    notesEncrypted,
    meta,
  });
  await AuditLog.create({
    user: user._id,
    action: "create_record",
    meta: { id: record._id },
  });
  res.json({ record });
};

export const getRecords = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { owner } = req.query; // admin/doctor may pass owner
  const queryOwner =
    owner && (user.role === "admin" || user.role === "doctor")
      ? owner
      : user._id;
  const records = await HealthRecord.find({ owner: queryOwner });
  const out = records.map((r) => ({
    id: r._id,
    type: r.type,
    title: r.title,
    meta: r.meta,
    notes: decryptJSON(r.notesEncrypted),
    createdAt: r.createdAt,
  }));
  res.json({ records: out });
};

export const updateRecord = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const rec = await HealthRecord.findById(id);
  if (!rec) return res.status(404).json({ message: "Not found" });
  if (
    rec.owner.toString() !== user._id.toString() &&
    user.role !== "admin" &&
    user.role !== "doctor"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { title, notes, meta } = req.body;
  if (title) rec.title = title;
  if (notes) rec.notesEncrypted = encryptJSON(notes);
  if (meta) rec.meta = meta;
  await rec.save();
  await AuditLog.create({
    user: user._id,
    action: "update_record",
    meta: { id: rec._id },
  });
  res.json({ record: rec });
};

export const deleteRecord = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const rec = await HealthRecord.findById(id);
  if (!rec) return res.status(404).json({ message: "Not found" });
  if (rec.owner.toString() !== user._id.toString() && user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  await rec.deleteOne();
  await AuditLog.create({
    user: user._id,
    action: "delete_record",
    meta: { id },
  });
  res.json({ ok: true });
};
