import { requireAuth } from "./middleware/auth";
import { base } from "./middleware/base";

export const publicProcedure = base;
export const protectedProcedure = publicProcedure.use(requireAuth);
