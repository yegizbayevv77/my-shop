// src/app/admin/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Prisma, type OrderStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  await assertAdmin();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price"));
  const stock = parseInt(String(formData.get("stock") || "0"), 10);
  const categoryId = String(formData.get("categoryId") || "");
  const isFeatured = formData.get("isFeatured") === "on";

  // Multiple image URLs — one per line
  const images = String(formData.get("images") || "")
    .split(/\r?\n/)
    .map((u) => u.trim())
    .filter((u) => u.length > 0);

  if (!name || !categoryId || Number.isNaN(price)) {
    throw new Error("Invalid input");
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: new Prisma.Decimal(price),
      stock: Number.isNaN(stock) ? 0 : stock,
      categoryId,
      images:
        images.length > 0
          ? images
          : [`https://placehold.co/600x600?text=${encodeURIComponent(name)}`],
      isFeatured,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    // P2003 = foreign key constraint (product is referenced by an order)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return { ok: false, error: "Cannot delete: product is part of an existing order." };
    }
    return { ok: false, error: "Delete failed." };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await assertAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
}
