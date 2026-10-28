"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@software-system.design/ui/button";
import { ContentState } from "@software-system.design/ui/content-state";
import { getMessages } from "@/lib/messages";

function useRouteMessages() {
  const params = useParams();
  return getMessages(params.locale);
}

export function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const {
    dictionary: { common },
  } = useRouteMessages();
  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl px-6 py-20">
      <ContentState
        status="error"
        title={common.errorTitle}
        actions={<Button onClick={reset}>{common.retry}</Button>}
      >
        <p>{common.errorDescription}</p>
      </ContentState>
    </main>
  );
}

export function RouteLoading() {
  const {
    dictionary: { common },
  } = useRouteMessages();
  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl px-6 py-20">
      <ContentState status="loading" title={common.loading} />
    </main>
  );
}

export function RouteNotFound() {
  const {
    locale,
    dictionary: { common },
  } = useRouteMessages();
  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl px-6 py-20">
      <h1 className="mb-6 text-3xl font-semibold">{common.notFound}</h1>
      <Link href={`/${locale}`} className="underline">
        {common.returnHome}
      </Link>
    </main>
  );
}
