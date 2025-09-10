import { Request, Response } from "express";
import Reminder from "../models/Reminder";
import AuditLog from "../models/AuditLog";

export const createReminder = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, message, remindAt, repeat } = req.body;
  const reminder = await Reminder.create({
    owner: user._id,
    title,
    message,
    remindAt,
    repeat,
  });
  await AuditLog.create({
    user: user._id,
    action: "create_reminder",
    meta: { id: reminder._id },
  });
  res.json({ reminder });
};

export const listReminders = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const reminders = await Reminder.find({ owner: user._id });
  res.json({ reminders });
};

export const markDone = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const rem = await Reminder.findById(id);
  if (!rem) return res.status(404).json({ message: "Not found" });
  if (rem.owner.toString() !== user._id.toString())
    return res.status(403).json({ message: "Forbidden" });
  rem.done = true;
  await rem.save();
  await AuditLog.create({
    user: user._id,
    action: "mark_reminder_done",
    meta: { id },
  });
  res.json({ ok: true });
};
