import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export { app };
