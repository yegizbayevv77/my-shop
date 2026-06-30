// src/components/order-status-badge.tsx
import type { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="secondary" className={STYLES[status]}>
      {status}
    </Badge>
  );
}
