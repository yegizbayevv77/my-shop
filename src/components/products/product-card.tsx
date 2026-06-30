// src/components/products/product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { StarIcon, ShoppingCartIcon } from "lucide-react";

import type { ProductDTO } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: ProductDTO }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Card className="glass glow-hover flex flex-col overflow-hidden pt-0">
      <Link
        href={`/products/${product.slug}`}
        className="group relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.images[0] ?? "https://placehold.co/600x600?text=No+Image"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.stock <= 0 && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            Out of stock
          </Badge>
        )}
      </Link>

      <CardContent className="flex-1 space-y-1">
        {product.categoryName && (
          <p className="text-xs text-muted-foreground">{product.categoryName}</p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-medium leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
          {product.rating.toFixed(1)}
          <span>({product.numReviews})</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
        <Button size="sm" onClick={handleAdd} disabled={product.stock <= 0}>
          <ShoppingCartIcon className="size-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
