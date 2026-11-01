import { RPCHandler } from "@orpc/server/fetch";
import { rpcRouter } from "../router";

const handler = new RPCHandler(rpcRouter);

export async function POST(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {},
  });
  const result = response ?? new Response("Not found", { status: 404 });
  result.headers.set("Cache-Control", "no-store");
  return result;
}
