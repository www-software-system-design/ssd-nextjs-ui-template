import assert from "node:assert/strict";
import { test } from "node:test";
import { previewMessageAction } from "./actions/message-preview.action.ts";
import { createMessagePreview } from "./services/create-message-preview.ts";

await test("preview rejects malformed, missing, blank, file, and oversized input", () => {
  for (const input of [
    null,
    [],
    "message",
    {},
    { message: 123 },
    { message: " \n " },
    { message: new File(["hello"], "message.txt") },
  ]) {
    assert.deepEqual(createMessagePreview(input), {
      status: "invalid",
      fieldErrors: { message: "required" },
    });
  }
  for (const message of ["x".repeat(501), ` ${"x".repeat(500)}`]) {
    assert.deepEqual(createMessagePreview({ message }), {
      status: "invalid",
      fieldErrors: { message: "tooLong" },
    });
  }
});

await test("preview trims, counts Unicode code points, and accepts the boundary", () => {
  assert.deepEqual(createMessagePreview({ message: "  Hi 👋\n " }), {
    status: "success",
    data: { message: "Hi 👋", characters: 4 },
  });
  const message = "x".repeat(500);
  assert.deepEqual(createMessagePreview({ message, ignored: "unused" }), {
    status: "success",
    data: { message, characters: 500 },
  });
});

await test("action validates FormData independently of previous state and returns serializable state", async () => {
  const form = new FormData();
  form.set("message", " Hello ");
  form.set("$ACTION_ID_example", "ignored");
  const result = await previewMessageAction({ status: "idle" }, form);
  assert.deepEqual(result, {
    status: "success",
    data: { message: "Hello", characters: 5 },
    values: { message: " Hello " },
  });
  assert.deepEqual(structuredClone(result), result);

  form.delete("message");
  assert.deepEqual(await previewMessageAction(result, form), {
    status: "invalid",
    fieldErrors: { message: "required" },
    values: { message: "" },
  });
  form.set("message", new File(["hello"], "message.txt"));
  assert.equal((await previewMessageAction(result, form)).status, "invalid");
  form.set("message", "x".repeat(501));
  const invalid = await previewMessageAction(result, form);
  assert.equal(invalid.status, "invalid");
  assert.ok("values" in invalid);
  assert.equal(invalid.values.message.length, 500);
});
