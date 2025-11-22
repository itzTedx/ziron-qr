import { requireAuth } from "./context/auth";
import { base } from "./context/base";

export const publicProcedure = base;
export const protectedProcedure = publicProcedure.use(requireAuth);
