import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use("/api", routes);

app.get("/", (req, res) => res.json({ ok: true, message: "PHR backend up" }));

app.use(errorHandler);

export default app;
