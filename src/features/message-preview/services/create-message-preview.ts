import "server-only";
import type { PreviewResult } from "../model/preview.ts";
import { validateMessage } from "../schemas/message.ts";

// Public, stateless example: previews input without saving or logging it.
// Put real integrations and resource-level authorization in this server-only layer.
export function createMessagePreview(input: unknown): PreviewResult {
  const validated = validateMessage(input);
  if (!validated.success) {
    return { status: "invalid", fieldErrors: { message: validated.error } };
  }

  return {
    status: "success",
    data: {
      message: validated.message,
      characters: Array.from(validated.message).length,
    },
  };
}
