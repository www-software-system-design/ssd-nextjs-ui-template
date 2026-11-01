"use server";

import {
  messageMaxLength,
  type MessagePreviewActionState,
} from "../model/preview.ts";
import { createMessagePreview } from "../services/create-message-preview.ts";

// eslint-disable-next-line @typescript-eslint/require-await -- Next.js requires async actions; this stateless example has no I/O.
export async function previewMessageAction(
  _previousState: MessagePreviewActionState,
  formData: FormData,
): Promise<MessagePreviewActionState> {
  // Every argument is untrusted, including previous state and hidden fields.
  // Authenticate here before calling a protected service in a real workflow.
  const message = formData.get("message");
  const result = createMessagePreview({ message });

  return {
    ...result,
    values: {
      message:
        typeof message === "string" ? message.slice(0, messageMaxLength) : "",
    },
  };
}
