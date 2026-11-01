import "server-only";
import { os } from "@orpc/server";
import { messagePreviewInputSchema } from "../schemas/message.ts";
import { createMessagePreview } from "../services/create-message-preview.ts";

// This public procedure is stateless. Protected procedures need verified context
// and resource authorization in the service, regardless of their transport.
export const messagePreviewRouter = {
  create: os
    .route({ method: "POST" })
    .input(messagePreviewInputSchema)
    .handler(({ input }) => createMessagePreview(input)),
};
