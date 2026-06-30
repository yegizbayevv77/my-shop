// prisma/seed.ts
import "dotenv/config";
import { PrismaClient, Prisma, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Seed through the DIRECT (session-mode) connection — port 5432.
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────
// Test data
// ─────────────────────────────────────────────
const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Books", slug: "books" },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  categorySlug: string;
};

const products: SeedProduct[] = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30h battery life and USB-C fast charging.",
    price: 199.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"],
    stock: 50,
    rating: 4.7,
    numReviews: 128,
    isFeatured: true,
    categorySlug: "electronics",
  },
  {
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    description:
      "Hot-swappable mechanical keyboard with per-key RGB lighting and aluminum frame.",
    price: 89.0,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"],
    stock: 80,
    rating: 4.5,
    numReviews: 64,
    isFeatured: true,
    categorySlug: "electronics",
  },
  {
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-t-shirt",
    description: "100% organic cotton crew-neck t-shirt. Soft, breathable, pre-shrunk.",
    price: 24.5,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"],
    stock: 200,
    rating: 4.3,
    numReviews: 41,
    isFeatured: false,
    categorySlug: "clothing",
  },
  {
    name: "Slim-Fit Denim Jacket",
    slug: "slim-fit-denim-jacket",
    description: "Timeless slim-fit denim jacket with brushed-metal buttons.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop"],
    stock: 35,
    rating: 4.6,
    numReviews: 22,
    isFeatured: true,
    categorySlug: "clothing",
  },
  {
    name: "Stainless Steel French Press",
    slug: "stainless-steel-french-press",
    description: "Double-walled 1L French press that keeps coffee hot for hours.",
    price: 34.95,
    images: ["https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&h=600&fit=crop"],
    stock: 120,
    rating: 4.4,
    numReviews: 89,
    isFeatured: false,
    categorySlug: "home-kitchen",
  },
  {
    name: "Non-Stick Cookware Set (10 pcs)",
    slug: "non-stick-cookware-set-10-pcs",
    description: "Complete 10-piece non-stick cookware set, dishwasher safe.",
    price: 149.0,
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop"],
    stock: 25,
    rating: 4.8,
    numReviews: 210,
    isFeatured: true,
    categorySlug: "home-kitchen",
  },
  {
    name: "The Pragmatic Programmer",
    slug: "the-pragmatic-programmer",
    description: "Your journey to mastery — 20th anniversary edition.",
    price: 39.99,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
    stock: 60,
    rating: 4.9,
    numReviews: 312,
    isFeatured: false,
    categorySlug: "books",
  },
  {
    name: "Clean Code",
    slug: "clean-code",
    description: "A handbook of agile software craftsmanship by Robert C. Martin.",
    price: 42.0,
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop"],
    stock: 45,
    rating: 4.7,
    numReviews: 178,
    isFeatured: true,
    categorySlug: "books",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clean (order matters because of FKs)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin + test user
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const userPassword = await bcrypt.hash("user1234", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@shop.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: "Test User",
      email: "user@shop.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  // 3. Categories
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    categoryMap.set(c.slug, created.id);
  }

  // 4. Products
  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: new Prisma.Decimal(p.price),
        images: p.images,
        stock: p.stock,
        rating: p.rating,
        numReviews: p.numReviews,
        isFeatured: p.isFeatured,
        categoryId,
      },
    });
  }

  console.log(
    `✅ Done. ${categories.length} categories, ${products.length} products, 2 users (admin@shop.com / user@shop.com).`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
