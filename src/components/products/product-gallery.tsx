// src/components/products/product-gallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const safeImages =
    images.length > 0 ? images : ["https://placehold.co/600x600?text=No+Image"];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
        <Image
          src={safeImages[active]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative size-16 overflow-hidden rounded-md border transition ${
                i === active ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
