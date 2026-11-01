import assert from "node:assert/strict";
import { test } from "node:test";
import { ORPCError } from "@orpc/client";
import { RPCHandler } from "@orpc/server/fetch";
import { createMessagePreviewClient } from "./rpc/client.ts";
import { previewMessage } from "./rpc/preview-message.ts";
import { messagePreviewRouter } from "./rpc/router.ts";

await test("typed RPC client and direct server call produce the same preview", async () => {
  const handler = new RPCHandler({ messagePreview: messagePreviewRouter });
  const requests: Request[] = [];
  const client = createMessagePreviewClient(
    "https://example.test",
    async (request) => {
      requests.push(request);
      const { response } = await handler.handle(request, {
        prefix: "/api/rpc",
      });
      assert.ok(response);
      return response;
    },
  );

  const input = { message: "  Hi 👋  " };
  assert.deepEqual(await client.create(input), await previewMessage(input));
  const request = requests[0];
  assert.ok(request);
  assert.equal(request.method, "POST");
  assert.equal(new URL(request.url).pathname, "/api/rpc/messagePreview/create");
  const message = "x".repeat(500);
  assert.deepEqual(await client.create({ message }), {
    status: "success",
    data: { message, characters: 500 },
  });

  for (const message of [" ", "x".repeat(501), ` ${"x".repeat(500)}`]) {
    await assert.rejects(client.create({ message }), (error: unknown) => {
      assert.ok(error instanceof ORPCError);
      assert.equal(error.code, "BAD_REQUEST");
      assert.equal(error.status, 400);
      return true;
    });
  }
});

await test("RPC runtime validation rejects untyped HTTP input and unknown procedures", async () => {
  const handler = new RPCHandler({ messagePreview: messagePreviewRouter });
  for (const input of [null, [], {}, { message: 123 }]) {
    const { response } = await handler.handle(
      new Request("https://example.test/api/rpc/messagePreview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: input }),
      }),
      { prefix: "/api/rpc" },
    );
    assert.equal(response?.status, 400);
    const body: unknown = await response?.json();
    assert.ok(body && typeof body === "object" && "json" in body);
    assert.deepEqual(body.json, {
      defined: false,
      code: "BAD_REQUEST",
      status: 400,
      message: "Input validation failed",
      data: { issues: [{ message: "required", path: ["message"] }] },
    });
  }
  const missing = await handler.handle(
    new Request("https://example.test/api/rpc/missing", { method: "POST" }),
    { prefix: "/api/rpc" },
  );
  assert.equal(missing.matched, false);
});

await test("existing adapters keep field error results for untrusted input", async () => {
  for (const input of [
    null,
    [],
    "text",
    {},
    { message: new File(["x"], "x.txt") },
  ]) {
    assert.deepEqual(await previewMessage(input), {
      status: "invalid",
      fieldErrors: { message: "required" },
    });
  }
  assert.deepEqual(await previewMessage({ message: ` ${"x".repeat(500)}` }), {
    status: "invalid",
    fieldErrors: { message: "tooLong" },
  });
});
