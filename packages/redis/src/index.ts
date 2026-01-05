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
	lazyConnect: true,
	maxRetriesPerRequest: null,
};

const redis = new Redis(redisUrl as string, {
	...sharedOptions,
});

// const redis = redisUrl
// 	? (() => {
// 			const parsed = new URL(redisUrl);
// 			const db = parsed.pathname ? Number(parsed.pathname.replace("/", "")) : undefined;

// 			return new Redis({
// 				host: parsed.hostname,
// 				port: parsed.port ? Number(parsed.port) : 6379,
// 				username: parsed.username || undefined,
// 				password: parsed.password || redisPassword,
// 				db: Number.isNaN(db) ? undefined : db,
// 				tls: parsed.protocol === "rediss:" ? {} : undefined,
// 				...sharedOptions,
// 			});
// 		})()
// 	: new Redis({
// 			host: redisHost,
// 			port: Number(redisPort),
// 			// password: redisPassword,
// 			...sharedOptions,
// 		});

redis.on("error", (err) => {
	console.error("[Redis Error] Unhandled error event:", err);
});

export default redis;
