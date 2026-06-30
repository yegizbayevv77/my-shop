// src/lib/products.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductDTO, CategoryDTO, SortOption } from "@/types";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

function toDTO(p: ProductWithCategory): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price), // Decimal -> number for client serialization
    images: p.images,
    stock: p.stock,
    rating: p.rating,
    numReviews: p.numReviews,
    isFeatured: p.isFeatured,
    categoryId: p.categoryId,
    categoryName: p.category?.name,
  };
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export async function getFeaturedProducts(limit = 4): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: limit,
    orderBy: { rating: "desc" },
  });
  return products.map(toDTO);
}

export type ProductFilters = {
  query?: string;
  category?: string; // category slug
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
};

export async function getProducts(filters: ProductFilters): Promise<ProductDTO[]> {
  const { query, category, minPrice, maxPrice, sort } = filters;

  const where: Prisma.ProductWhereInput = {};

  if (query) {
    where.name = { contains: query, mode: "insensitive" };
  }
  if (category) {
    where.category = { slug: category };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "rating":
      orderBy = { rating: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });
  return products.map(toDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return product ? toDTO(product) : null;
}
