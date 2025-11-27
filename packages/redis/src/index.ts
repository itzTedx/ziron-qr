import Redis from "ioredis";

if (!process.env.REDIS_HOST) {
  throw new Error("Missing REDIS_HOST");
}

if (!process.env.REDIS_PORT) {
  throw new Error("Missing REDIS_PORT");
}

// const redisUrl = process.env.REDIS_URL;

// if (!redisUrl) {
//   throw new Error("REDIS_URL environment variable is not set.");
// }

// const redis = new Redis(`${redisUrl}`);

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  lazyConnect: true,
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => {
  console.error("[Redis Error] Unhandled error event:", err);
});

export default redis;
