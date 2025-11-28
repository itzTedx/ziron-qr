import type { NextRequest } from "next/server";

import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ORPCError, ValidationError, onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

import { createContext } from "@ziron/api/middleware/context";
import { router } from "@ziron/api/routers/index";
import { z } from "@ziron/validators";

// const rpcHandler = new RPCHandler(router, {
//   interceptors: [
//     onError((error) => {
//       console.error(error);
//     }),
//   ],

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  clientInterceptors: [
    onError((error) => {
      if (error instanceof ORPCError && error.code === "BAD_REQUEST" && error.cause instanceof ValidationError) {
        // If you only use Zod you can safely cast to ZodIssue[]
        const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

        throw new ORPCError("INPUT_VALIDATION_FAILED", {
          status: 422,
          message: z.prettifyError(zodError),
          data: z.flattenError(zodError),
          cause: error.cause,
        });
      }

      if (
        error instanceof ORPCError &&
        error.code === "INTERNAL_SERVER_ERROR" &&
        error.cause instanceof ValidationError
      ) {
        throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
          cause: error.cause,
        });
      }
    }),
  ],
});

const apiHandler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

async function handleRequest(req: NextRequest) {
  const rpcResult = await rpcHandler.handle(req, {
    prefix: "/api/rpc",
    context: await createContext(req),
  });
  if (rpcResult.response) return rpcResult.response;

  const apiResult = await apiHandler.handle(req, {
    prefix: "/api/rpc/api-reference",
    context: await createContext(req),
  });
  if (apiResult.response) return apiResult.response;

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
