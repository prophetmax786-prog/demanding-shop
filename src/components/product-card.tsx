import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/$slug"
      params={{ slug: product.slug }}
      className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper shadow-sm transition-colors hover:border-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
    >
      <span className="flex aspect-square items-center justify-center bg-mist p-3">
        <img
          src={product.imageDataUrl}
          alt=""
          className="max-h-full max-w-full object-contain"
        />
      </span>
      <span className="flex flex-1 flex-col p-3">
        <span className="line-clamp-2 text-sm font-bold leading-snug sm:text-base">
          {product.title}
        </span>
        <span className="mt-1 line-clamp-2 text-sm leading-5 text-muted">{product.description}</span>
        <span className="mt-3 text-sm font-semibold text-link">See this pick</span>
      </span>
    </Link>
  );
}