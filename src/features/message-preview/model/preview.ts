export const messageMaxLength = 500;

export type MessageError = "required" | "tooLong";

export type PreviewResult =
  | { status: "invalid"; fieldErrors: { message: MessageError } }
  | { status: "success"; data: { message: string; characters: number } };

export type MessagePreviewActionState =
  { status: "idle" } | (PreviewResult & { values: { message: string } });

export const initialMessagePreviewActionState: MessagePreviewActionState = {
  status: "idle",
};
