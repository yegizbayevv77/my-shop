// src/app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { StarIcon } from "lucide-react";

import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "@/components/products/add-to-cart";
import { ProductGallery } from "@/components/products/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Params = Promise<{ slug: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link href="/products" className="text-sm text-muted-foreground hover:underline">
        ← Back to catalog
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Details */}
        <div className="space-y-4">
          {product.categoryName && (
            <Badge variant="secondary">{product.categoryName}</Badge>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
              {product.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span>{product.numReviews} reviews</span>
          </div>

          <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>

          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
          </p>

          <Separator />

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <AddToCart product={product} />
        </div>
      </div>
    </main>
  );
}
