import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArticleCard } from "@/components/article-card";
import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/search-form";
import { SiteFrame } from "@/components/site-frame";
import { buttonVariants } from "@/components/ui/button";
import { articles } from "@/lib/articles";
import { useCatalog, useCatalogHydrated } from "@/lib/catalog";
import { cn } from "@/lib/cn";

type HomeSearch = { q?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const q = typeof search.q === "string" ? search.q.trim() : "";
    return q ? { q } : {};
  },
  component: HomePage,
});

function HomePage() {
  const { q: query = "" } = Route.useSearch();
  const hydrated = useCatalogHydrated();
  const products = useCatalog((state) => state.products);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle),
    );
  }, [products, query]);

  return (
    <SiteFrame>
      <section className="border-b border-line bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-sm font-semibold text-link">demanding.shop · a practical shopping guide</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Online shopping, with the noise turned down.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Compare from home, keep a record of what you bought, and open a clean product page
            when you are ready. Demanding sends you to Amazon to finish the purchase.
          </p>
        </div>
      </section>
      {/* Rest of homepage content */}
    </SiteFrame>
  );
}