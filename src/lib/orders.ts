// src/lib/orders.ts
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export type OrderItemDTO = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
};

export type OrderDTO = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  items: OrderItemDTO[];
};

const includeItems = {
  orderItems: { include: { product: true } },
} as const;

type DbOrder = Awaited<ReturnType<typeof fetchOne>>;

async function fetchOne(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { ...includeItems, user: true },
  });
}

function toDTO(order: NonNullable<DbOrder>): OrderDTO {
  return {
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    customerName: order.user?.name ?? null,
    customerEmail: order.user?.email ?? null,
    items: order.orderItems.map((it) => ({
      id: it.id,
      productId: it.productId,
      name: it.product.name,
      slug: it.product.slug,
      image: it.product.images[0] ?? "",
      price: Number(it.price),
      quantity: it.quantity,
    })),
  };
}

export async function getUserOrders(userId: string): Promise<OrderDTO[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { ...includeItems, user: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toDTO);
}

export async function getAllOrders(): Promise<OrderDTO[]> {
  const orders = await prisma.order.findMany({
    include: { ...includeItems, user: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toDTO);
}
