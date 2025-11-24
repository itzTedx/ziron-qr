import { NextRequest } from "next/server";

import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

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

async function handleRequest(request: NextRequest) {
  const rpcResult = await rpcHandler.handle(request, {
    prefix: "/api/rpc",
    context: { request, headers: request.headers },
  });
  if (rpcResult.response) return rpcResult.response;

  const apiResult = await apiHandler.handle(request, {
    prefix: "/api/rpc/docs",
    context: { request, headers: request.headers },
  });
  if (apiResult.response) return apiResult.response;

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
