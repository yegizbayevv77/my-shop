// src/components/products/add-to-cart.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";

import type { ProductDTO } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";

export function AddToCart({ product }: { product: ProductDTO }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] ?? "",
        stock: product.stock,
      },
      quantity
    );
    toast.success(`${quantity} × ${product.name} added to cart`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-md border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={outOfStock || quantity <= 1}
          aria-label="Decrease quantity"
        >
          <MinusIcon className="size-4" />
        </Button>
        <span className="w-10 text-center tabular-nums">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={outOfStock || quantity >= product.stock}
          aria-label="Increase quantity"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      <Button onClick={handleAdd} disabled={outOfStock} size="lg" className="flex-1">
        <ShoppingCartIcon className="size-4" />
        {outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  );
}
