// src/app/admin/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LayoutDashboardIcon, PackageIcon, ShoppingBagIcon } from "lucide-react";

import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth (middleware also guards /admin)
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8">
      <aside className="w-48 shrink-0">
        <h2 className="mb-4 px-2 text-sm font-semibold text-muted-foreground">ADMIN</h2>
        <nav className="space-y-1 text-sm">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
          >
            <LayoutDashboardIcon className="size-4" /> Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
          >
            <PackageIcon className="size-4" /> Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
          >
            <ShoppingBagIcon className="size-4" /> Orders
          </Link>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
