import { createORPCClient } from "@orpc/client";
import { RPCLink, type RPCLinkOptions } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { messagePreviewRouter } from "./router.ts";

// Server imports are type-only and erased. Pass an absolute origin explicitly;
// never read window during module evaluation or fetch this app from server code.
export function createMessagePreviewClient(
  origin: string | URL,
  fetch?: RPCLinkOptions<Record<never, never>>["fetch"],
): RouterClient<typeof messagePreviewRouter> {
  return createORPCClient(
    new RPCLink({
      url: new URL("/api/rpc/messagePreview", origin),
      ...(fetch ? { fetch } : {}),
    }),
  );
}
