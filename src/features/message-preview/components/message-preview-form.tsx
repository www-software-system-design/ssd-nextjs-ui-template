"use client";

import { useActionState } from "react";
import { Button } from "@software-system.design/ui/button";
import { TextArea } from "@software-system.design/ui/text-area";
import type { Dictionary } from "@/lib/messages";
import { previewMessageAction } from "../actions/message-preview.action";
import {
  initialMessagePreviewActionState,
  messageMaxLength,
} from "../model/preview";

export function MessagePreviewForm({
  messages,
}: {
  messages: Dictionary["messagePreview"];
}) {
  const [state, formAction, pending] = useActionState(
    previewMessageAction,
    initialMessagePreviewActionState,
  );
  const error =
    state.status === "invalid"
      ? messages.errors[state.fieldErrors.message]
      : null;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <label htmlFor="preview-message" className="font-medium">
        {messages.label}
      </label>
      <TextArea
        id="preview-message"
        name="message"
        rows={4}
        required
        maxLength={messageMaxLength}
        defaultValue={state.status === "idle" ? "" : state.values.message}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "message-hint message-error" : "message-hint"}
      />
      <p id="message-hint" className="text-sm">
        {messages.hint}
      </p>
      <div aria-live="polite" aria-atomic="true">
        {error && (
          <p id="message-error" className="font-medium">
            {error}
          </p>
        )}
        {state.status === "success" && (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{messages.resultTitle}</h2>
            <p className="whitespace-pre-wrap break-words">
              {state.data.message}
            </p>
            <p>
              {messages.characters}: {state.data.characters}
            </p>
          </section>
        )}
      </div>
      <Button type="submit" loading={pending} loadingLabel={messages.pending}>
        {messages.submit}
      </Button>
    </form>
  );
}
