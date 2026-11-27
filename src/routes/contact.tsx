import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Contact</h1>
        <p className="mt-4 text-muted">For any questions about the site or products, you can reach out via the form below (coming soon).</p>
      </div>
    </SiteFrame>
  );
}