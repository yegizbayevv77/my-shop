// src/app/checkout/success/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleCheckIcon } from "lucide-react";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  // Payment succeeded → empty the cart
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <CircleCheckIcon className="size-16 text-green-500" />
      <h1 className="mt-4 text-2xl font-bold">Payment successful!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your order. A confirmation will appear in your account once payment
        is verified.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/account/orders">View my orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
