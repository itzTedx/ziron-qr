import { NextRequest } from "next/server";

import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

import { createContext } from "@ziron/api/context/session";
import { router } from "@ziron/api/routers/index";

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});
const apiHandler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      docsTitle: "Ziron API Documentation",

      specGenerateOptions: {
        info: {
          title: "Ziron API",
          version: "1.0.0",
          summary: "Ziron API",
        },
      },
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
    prefix: "/api/rpc/docs",
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
