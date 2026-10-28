import { ContentCard } from "@software-system.design/ui/content-card";
import type { Dictionary } from "@/lib/i18n";

export function StarterScreen({
  messages,
}: {
  messages: Dictionary["starter"];
}) {
  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-20"
    >
      <h1 className="text-4xl font-semibold tracking-tight">
        {messages.title}
      </h1>
      <p className="max-w-2xl text-lg">{messages.description}</p>
      <ContentCard title={messages.cardTitle} headingLevel={2}>
        <p>{messages.cardDescription}</p>
      </ContentCard>
    </main>
  );
}
