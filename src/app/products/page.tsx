// src/app/products/page.tsx
import { Suspense } from "react";

import { getCategories, getProducts } from "@/lib/products";
import type { SortOption } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      query: sp.q,
      category: sp.category,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      sort: (sp.sort as SortOption) || undefined,
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Catalog</h1>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <Suspense fallback={null}>
          <ProductFilters categories={categories} />
        </Suspense>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"} found
          </p>
          {products.length === 0 ? (
            <p className="text-muted-foreground">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
