import { NextRequest } from "next/server";

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import { clientRouter } from "@ziron/api/routers/index";

const handler = new RPCHandler(clientRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handleRequest(request: NextRequest) {
	const context = {
		request: request,
	};

	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context,
	});

	return response ?? new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
