import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/disclosure")({
  component: DisclosurePage,
});

function DisclosurePage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Affiliate Disclosure</h1>
        <p className="mt-4 leading-7">
          As an Amazon Associate I earn from qualifying purchases. This means if you click on a link
          and buy something on Amazon, I may receive a small commission at no extra cost to you.
        </p>
        <p className="mt-4 leading-7 text-muted">
          All opinions and product recommendations are based on research. The price you pay is always
          the same as buying directly from Amazon.
        </p>
      </div>
    </SiteFrame>
  );
}