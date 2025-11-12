import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

// Correctly look for REDIS_URL from your environment variables
const redisUrl = process.env.REDIS_URI || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Connected to Redis successfully!");
    } catch (err) {
      console.error("Could not connect to Redis:", err);
    }
  }
}

connectRedis();

export default redisClient;
