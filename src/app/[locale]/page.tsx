import { StarterScreen } from "@/features/starter/components/starter-screen";
import { getDictionary } from "@/lib/i18n";

export default async function LandingPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const { dictionary } = getDictionary(locale);
  return <StarterScreen messages={dictionary.starter} />;
}
