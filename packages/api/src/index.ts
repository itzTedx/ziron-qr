import { base } from "./middleware/base";
import { Context } from "./middleware/context";
import { requireAuth } from "./middleware/require-auth";

export const publicProcedure = base;
export const protectedProcedure = publicProcedure.$context<Context>().use(requireAuth);
