import { createMessagePreview } from "@/features/message-preview/services/create-message-preview";

const responseHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (
    request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !==
    "application/json"
  ) {
    return Response.json(
      {
        error: {
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Send application/json.",
        },
      },
      { status: 415, headers: responseHeaders },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json(
      { error: { code: "INVALID_JSON", message: "Send a valid JSON body." } },
      { status: 400, headers: responseHeaders },
    );
  }

  // This example is public. Authenticate before invoking protected services.
  const result = createMessagePreview(input);
  return Response.json(result, {
    status: result.status === "success" ? 200 : 422,
    headers: responseHeaders,
  });
}
