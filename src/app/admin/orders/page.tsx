// src/app/admin/orders/page.tsx
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Items</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t align-top">
                  <td className="p-3 font-mono text-xs">#{o.id.slice(-8)}</td>
                  <td className="p-3">
                    <div>{o.customerName || "—"}</div>
                    <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {o.items.map((it) => (
                      <div key={it.id}>
                        {it.quantity} × {it.name}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">{formatPrice(o.totalAmount)}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
