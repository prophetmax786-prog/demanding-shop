import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
        <p className="mt-4 leading-7 text-muted">
          This site stores product data and tracking information only in your browser (localStorage).
          No personal data is sent to any server. Affiliate links go directly to Amazon.
        </p>
      </div>
    </SiteFrame>
  );
}