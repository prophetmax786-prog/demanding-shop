import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteFrame } from "@/components/site-frame";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = useCatalog((state) => state.products.find((p) => p.slug === slug));

  useEffect(() => {
    if (product) document.title = product.title + " · Demanding";
  }, [product]);

  if (!product) {
    return (
      <SiteFrame>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <img src={product.imageDataUrl} alt="" className="mx-auto max-h-96 object-contain" />
        <h1 className="mt-6 text-3xl font-extrabold">{product.title}</h1>
        <p className="mt-3 text-muted">{product.description}</p>
        <p className="mt-6 text-sm font-semibold">As an Amazon Associate I earn from qualifying purchases.</p>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-md bg-orange px-8 py-3 text-lg font-bold text-black"
        >
          Buy from Amazon
        </a>
      </div>
    </SiteFrame>
  );
}