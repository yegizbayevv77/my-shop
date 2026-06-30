// src/app/account/orders/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getUserOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  // Middleware already guards this route; session is guaranteed here.
  const orders = session?.user?.id ? await getUserOrders(session.user.id) : [];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">You have no orders yet.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </CardHeader>

              <CardContent className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded bg-muted">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex-1 text-sm hover:underline"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                ))}

                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
