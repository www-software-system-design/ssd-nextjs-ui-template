"use server";

import {
  messageMaxLength,
  type MessagePreviewActionState,
} from "../model/preview.ts";
import { previewMessage } from "../rpc/preview-message.ts";

export async function previewMessageAction(
  _previousState: MessagePreviewActionState,
  formData: FormData,
): Promise<MessagePreviewActionState> {
  // Every argument is untrusted, including previous state and hidden fields.
  // Authenticate here before calling a protected service in a real workflow.
  const message = formData.get("message");
  const result = await previewMessage({ message });

  return {
    ...result,
    values: {
      message:
        typeof message === "string" ? message.slice(0, messageMaxLength) : "",
    },
  };
}
