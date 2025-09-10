import { Router } from "express";
import authRoutes from "./auth";
import healthRoutes from "./health"
import reminderRoutes from "./reminder";
import exportRoutes from "./export";

const router = Router();
router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/reminders", reminderRoutes);
router.use("/export", exportRoutes);

export default router;
