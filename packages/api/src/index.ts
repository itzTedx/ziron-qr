import { base } from "./middleware/base";
import { requireAuth } from "./middleware/require-auth";

export const publicProcedure = base;
export const protectedProcedure = publicProcedure.use(requireAuth);
