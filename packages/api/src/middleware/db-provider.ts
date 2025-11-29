import { os } from "@orpc/server";

import { db as database } from "@ziron/db/client";

export const dbProvider = os.$context<{ db?: typeof database }>().middleware(async ({ context, next }) => {
  /**
   * If db already exists, skip the connection.
   */

  const db = context.db ?? database;

  return next({ context: { db } });
});
