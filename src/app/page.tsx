// src/app/page.tsx
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

import { getCategories, getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      {/* Hero */}
      <section className="relative mb-16 overflow-hidden rounded-3xl border border-white/10 px-6 py-20 text-center sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <SparklesIcon className="size-3.5 text-primary" />
          New season, new drops
        </span>

        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Shop the <span className="text-gradient">future</span>, today.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
          Curated products, premium quality, lightning-fast checkout. Find something
          you&apos;ll love.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/30">
            <Link href="/products">
              Shop now <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/15">
            <Link href="/products">Browse catalog</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="mb-5 text-2xl font-semibold tracking-tight">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="glass glow-hover group flex items-center justify-between rounded-2xl p-6 font-medium"
            >
              {c.name}
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured products</h2>
          <Button variant="link" asChild className="text-primary">
            <Link href="/products">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
