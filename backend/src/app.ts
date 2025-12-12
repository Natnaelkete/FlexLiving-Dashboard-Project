import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/index";
import { globalErrorHandler } from "./middleware/error.middleware";
import { AppError } from "./lib/appError";

const app = express();

app.use(helmet());
app.use(cors({
  origin: "*", // Allow all origins for now to fix CORS issues
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(express.json());

// Handle preflight requests explicitly
app.options("*", cors());

// Mount router at /api for local development and explicit /api calls
app.use("/api", router);
// Also mount at / for Vercel if it strips the /api prefix
app.use("/", router);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export { app };
