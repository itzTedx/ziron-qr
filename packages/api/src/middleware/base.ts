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
