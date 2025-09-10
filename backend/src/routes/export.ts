import { Router } from "express";
import { auth } from "../middleware/auth";
import { exportPdf, exportJson } from "../controllers/exportController";

const r = Router();

r.get("/pdf", auth, exportPdf);
r.get("/json", auth, exportJson);

export default r;
