import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  affiliateUrl: string;
  imageDataUrl: string;
  createdAt: number;
  benefits?: string;
  buyerFit?: string;
};

type CatalogState = {
  products: Product[];
  addProducts: (items: Omit<Product, "id" | "slug" | "createdAt">[]) => void;
  removeProduct: (id: string) => void;
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: [],
      addProducts: (items) => {
        const created = items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
          slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          createdAt: Date.now(),
        }));
        set({ products: [...created, ...get().products] });
      },
      removeProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
    }),
    { name: "demanding-catalog" }
  )
);

export function useCatalogHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}