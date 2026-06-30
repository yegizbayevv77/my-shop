// src/components/layout/footer.tsx
import Link from "next/link";
import { StoreIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <StoreIcon className="size-5 text-primary" />
          <span className="text-gradient">My Shop</span>
        </Link>

        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/products" className="transition-colors hover:text-foreground">
            Catalog
          </Link>
          <Link href="/cart" className="transition-colors hover:text-foreground">
            Cart
          </Link>
          <Link href="/account/orders" className="transition-colors hover:text-foreground">
            Orders
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} My Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
