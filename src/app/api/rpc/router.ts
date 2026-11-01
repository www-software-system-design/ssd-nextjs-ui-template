import "server-only";
import { messagePreviewRouter } from "@/features/message-preview/rpc/router";

// Compose feature routers here; shared infrastructure cannot import features.
export const rpcRouter = { messagePreview: messagePreviewRouter };
