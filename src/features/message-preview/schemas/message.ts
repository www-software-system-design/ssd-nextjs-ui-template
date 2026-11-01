import { messageMaxLength, type MessageError } from "../model/preview.ts";

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
