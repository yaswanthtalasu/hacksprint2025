import { Router } from "express";
import { auth, permit } from "../middleware/auth";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/healthController";

const r = Router();

r.post("/", auth, createRecord);
r.get("/", auth, getRecords);
r.put("/:id", auth, updateRecord);
r.delete("/:id", auth, deleteRecord);

export default r;
