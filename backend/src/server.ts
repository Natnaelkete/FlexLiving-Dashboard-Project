import dotenv from "dotenv";
import { app } from "./app";
import { connectRedis } from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
