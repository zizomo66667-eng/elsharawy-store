"use client";

import { useState } from "react";

type Image = { id: string; url: string; alt: string | null };

export function ProductGallery({ images, name }: { images: Image[]; name: string }) {
  const list = images.length > 0 ? images : [{ id: "ph", url: "/placeholder-product.jpg", alt: name }];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] bg-surface rounded-[var(--card-radius)] overflow-hidden border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={list[active]?.url}
          alt={list[active]?.alt || name}
          className="w-full h-full object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 ${
                i === active ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
