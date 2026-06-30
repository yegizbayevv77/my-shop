// src/app/admin/products/page.tsx
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusIcon className="size-4" /> New product
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <Link href={`/products/${p.slug}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3 text-muted-foreground">{p.category.name}</td>
                <td className="p-3">{formatPrice(Number(p.price))}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-right">
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
