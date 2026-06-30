// src/types/index.ts
// Client-safe product shape. Prisma's Decimal is NOT serializable to client
// components, so server components convert `price` to a plain number.
export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  categoryId: string;
  categoryName?: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
};

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";
