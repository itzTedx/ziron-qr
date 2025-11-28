import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisUrl && (!redisHost || !redisPort)) {
  throw new Error("Missing Redis connection settings (REDIS_URL or REDIS_HOST/REDIS_PORT).");
}

if (!redisPassword) {
  throw new Error("Missing REDIS_PASSWORD");
}

const sharedOptions = {
  password: redisPassword,
  lazyConnect: true,
  maxRetriesPerRequest: null,
};

const redis = redisUrl
  ? new Redis(redisUrl, sharedOptions)
  : new Redis({
      host: redisHost,
      port: Number(redisPort),
      ...sharedOptions,
    });

redis.on("error", (err) => {
  console.error("[Redis Error] Unhandled error event:", err);
});

export default redis;
