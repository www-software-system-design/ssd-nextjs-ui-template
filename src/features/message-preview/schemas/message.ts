import type { StandardSchemaV1 } from "@standard-schema/spec";
import { messageMaxLength, type MessageError } from "../model/preview.ts";

type MessagePreviewInput = { message: string };

type ValidationResult =
  { success: true; message: string } | { success: false; error: MessageError };

export function validateMessage(input: unknown): ValidationResult {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    !("message" in input) ||
    typeof input.message !== "string" ||
    !input.message.trim()
  ) {
    return { success: false, error: "required" };
  }

  // Bound the original input, including whitespace, before normalization.
  if (input.message.length > messageMaxLength) {
    return { success: false, error: "tooLong" };
  }

  return { success: true, message: input.message.trim() };
}

// Reuse the domain validator while exposing a typed, runtime-validated RPC input.
export const messagePreviewInputSchema: StandardSchemaV1<
  MessagePreviewInput,
  MessagePreviewInput
> = {
  "~standard": {
    version: 1,
    vendor: "ssd-message-preview",
    validate(input) {
      const result = validateMessage(input);
      return result.success
        ? { value: { message: result.message } }
        : { issues: [{ message: result.error, path: ["message"] }] };
    },
  },
};
