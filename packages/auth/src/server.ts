import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";

import { db } from "@ziron/db/client";
import redis from "@ziron/redis";

import { authEnv } from "../env";

export function initAuth(options: {
  baseUrl: string;

  secret: string | undefined;
  trustedOrigins?: string[];
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
    }),

    appName: "Ziron QR",
    emailAndPassword: {
      enabled: true,
    },

    baseURL: options.baseUrl,
    secret: options.secret,

    user: {
      additionalFields: {
        role: {
          type: ["user", "admin", "dev"],
          input: false,
        },
      },
    },

    plugins: [nextCookies(), twoFactor()],

    rateLimit: {
      enabled: true,
      window: 60, // time window in seconds
      max: 100, // max requests in the window
    },

    secondaryStorage: {
      get: async (key) => {
        const value = await redis.get(key);
        return value ? value : null;
      },
      set: async (key, value, ttl) => {
        if (ttl) await redis.setex(key, ttl, value);
        else await redis.set(key, value);
      },
      delete: async (key) => {
        await redis.del(key);
      },
    },
    advanced: {
      cookiePrefix: "ziron",
      database: {
        generateId: false,
      },
    },
    trustedOrigins: [
      "https://ziron-qr-portal.vercel.app",
      "http://localhost:3000",
      "http://192.168.0.206:3000",
      authEnv().PRODUCTION_URL,
      ...(options.trustedOrigins || []),
    ],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
export type User = Auth["$Infer"]["Session"]["user"];
