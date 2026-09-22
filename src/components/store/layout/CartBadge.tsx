"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { useEffect, useState } from "react";

export function CartBadge() {
  const itemCount = useCart((s) => s.itemCount);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCount(itemCount());
    return useCart.subscribe(() => setCount(useCart.getState().itemCount()));
  }, [itemCount]);

  return (
    <Link href="/cart" className="p-2 text-muted-text hover:text-primary relative" aria-label="السلة">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-1.5 6h13M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
      {mounted && count > 0 && (
        <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-medium">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
