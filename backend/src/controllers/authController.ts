import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import AuditLog from "../models/AuditLog";

export interface AuthRequest extends Request {
  user?: IUser;
}

const signToken = (userId: string) =>
    //@ts-ignore
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// ✅ Register (only users can self-register)
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (role && role !== "user") {
      return res.status(403).json({
        message: "Only users can self-register. Doctors are seeded by admin.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // 🔥 plain text here, schema hook will hash
      role: "user",
    });

    await AuditLog.create({ user: user._id, action: "register", ip: req.ip });

    const token = signToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};

// ✅ Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // explicitly select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id.toString());

    await AuditLog.create({ user: user._id, action: "login", ip: req.ip });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

// ✅ Current user
export const me = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};
