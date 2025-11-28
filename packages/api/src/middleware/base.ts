import { os } from "@orpc/server";

import { Context } from "./context";

export const base = os.$context<Context>().errors({
  UNAUTHORIZED: {
    message: "You are not authorized to access this endpoint.",
    status: 401,
  },
  FORBIDDEN: {
    message: "You are not allowed to access this endpoint.",
    status: 403,
  },
  NOT_FOUND: {
    message: "The resource you are looking for does not exist.",
    status: 404,
  },
  INTERNAL_SERVER_ERROR: {
    message: "An internal server error occurred.",
    status: 500,
  },
  BAD_REQUEST: {
    message: "The request was invalid.",
    status: 400,
  },
  SERVICE_UNAVAILABLE: {
    message: "The service is unavailable.",
    status: 503,
  },
});
// .use(
//   onError((error) => {
//     if (error instanceof ORPCError && error.code === "BAD_REQUEST" && error.cause instanceof ValidationError) {
//       // If you only use Zod you can safely cast to ZodIssue[]
//       const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

//       throw new ORPCError("INPUT_VALIDATION_FAILED", {
//         status: 422,
//         message: z.prettifyError(zodError),
//         data: z.flattenError(zodError),
//         cause: error.cause,
//       });
//     }

//     if (
//       error instanceof ORPCError &&
//       error.code === "INTERNAL_SERVER_ERROR" &&
//       error.cause instanceof ValidationError
//     ) {
//       throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
//         cause: error.cause,
//       });
//     }
//   })
// );
