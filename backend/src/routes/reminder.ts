
import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createReminder,
  listReminders,
  markDone,
} from "../controllers/reminderController";

const r = Router();

r.post("/", auth, createReminder);
r.get("/", auth, listReminders);
r.post("/:id/done", auth, markDone);

export default r;