import type { Metadata } from "next";
import { MessagePreviewForm } from "@/features/message-preview/components/message-preview-form";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/examples/message-preview">): Promise<Metadata> {
  const { locale } = await params;
  const { dictionary } = getDictionary(locale);
  return { title: dictionary.messagePreview.title };
}

export default async function MessagePreviewPage({
  params,
}: PageProps<"/[locale]/examples/message-preview">) {
  const { locale } = await params;
  const { dictionary } = getDictionary(locale);
  const messages = dictionary.messagePreview;

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-16"
    >
      <h1 className="text-4xl font-semibold">{messages.title}</h1>
      <p className="max-w-2xl">{messages.description}</p>
      <MessagePreviewForm messages={messages} />
    </main>
  );
}
