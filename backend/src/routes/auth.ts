import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { auth } from "../middleware/auth";

const r = Router();

r.post("/register", register);
r.post("/login", login);
r.get("/me", auth, me);

export default r;
