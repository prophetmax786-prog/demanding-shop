import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Terms of Use</h1>
        <p className="mt-4 leading-7 text-muted">
          By using demanding.shop you agree that product recommendations are for information only.
          Purchases are completed on Amazon. We are not responsible for Amazon’s pricing, shipping, or product quality.
        </p>
      </div>
    </SiteFrame>
  );
}