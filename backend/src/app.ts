import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/index";
import { globalErrorHandler } from "./middleware/error.middleware";
import { AppError } from "./lib/appError";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export { app };
