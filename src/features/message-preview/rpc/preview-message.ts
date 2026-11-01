import "server-only";
import { call } from "@orpc/server";
import type { PreviewResult } from "../model/preview.ts";
import { validateMessage } from "../schemas/message.ts";
import { messagePreviewRouter } from "./router.ts";

// Existing HTTP/form contracts return field errors as data. Validate unknown
// transport input before the typed call; the procedure also validates RPC callers.
export async function previewMessage(input: unknown): Promise<PreviewResult> {
  const validated = validateMessage(input);
  if (!validated.success) {
    return { status: "invalid", fieldErrors: { message: validated.error } };
  }

  return call(messagePreviewRouter.create, { message: validated.message });
}
