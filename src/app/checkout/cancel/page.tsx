// src/app/checkout/cancel/page.tsx
import Link from "next/link";
import { CircleXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <CircleXIcon className="size-16 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-bold">Checkout cancelled</h1>
      <p className="mt-2 text-muted-foreground">
        Your payment was cancelled. Your cart is still saved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/cart">Back to cart</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
