import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">About Demanding</h1>
        <p className="mt-4 leading-7 text-muted">
          Demanding is a practical shopping guide. We share useful product picks and clear information
          so you can decide what to buy. When you are ready, we send you to Amazon to complete your purchase.
        </p>
      </div>
    </SiteFrame>
  );
}