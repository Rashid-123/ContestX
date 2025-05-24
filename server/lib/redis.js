// src/lib/redis.js (or utils/redis.js)
import { Redis } from '@upstash/redis';
import dotenv from "dotenv"
dotenv.config();

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL is not defined in environment variables.");
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("UPSTASH_REDIS_REST_TOKEN is not defined in environment variables.");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// You can also export a different client if you need specific configurations for different use cases.