// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { MinusIcon, PlusIcon, Trash2Icon, Loader2Icon } from "lucide-react";

import {
  useCartStore,
  selectTotalItems,
  selectTotalPrice,
} from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const router = useRouter();
  const { status } = useSession();

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => setMounted(true), []);

  async function handleCheckout() {
    // Protected action: require authentication
    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error || "Checkout failed");
        setLoading(false);
        return;
      }
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse catalog</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping cart</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.image || "https://placehold.co/200x200?text=No+Image"}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} each
                  </span>

                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <div className="flex items-center rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <MinusIcon className="size-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase"
                      >
                        <PlusIcon className="size-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="h-fit">
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items ({totalItems})</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
              {loading && <Loader2Icon className="size-4 animate-spin" />}
              {status === "authenticated" ? "Checkout" : "Sign in to checkout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
