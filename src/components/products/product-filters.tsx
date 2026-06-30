// src/components/products/product-filters.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import type { CategoryDTO } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function ProductFilters({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // ── Live search (debounced) ──
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const t = setTimeout(() => updateParams({ q: q || undefined }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  return (
    <aside className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className={selectClass}
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParams({ category: e.target.value || undefined })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Price range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() =>
            updateParams({
              minPrice: minPrice || undefined,
              maxPrice: maxPrice || undefined,
            })
          }
        >
          Apply price
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort">Sort by</Label>
        <select
          id="sort"
          className={selectClass}
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParams({ sort: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => {
          setQ("");
          setMinPrice("");
          setMaxPrice("");
          router.replace(pathname, { scroll: false });
        }}
      >
        Clear filters
      </Button>
    </aside>
  );
}
