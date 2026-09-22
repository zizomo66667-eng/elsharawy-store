"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string; // productId + variantId
  productId: string;
  variantId?: string | null;
  name: string;
  image?: string | null;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => {
    ok: boolean;
    error?: string;
  };
  updateQuantity: (key: string, quantity: number) => { ok: boolean; error?: string };
  removeItem: (key: string) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

function makeKey(productId: string, variantId?: string | null) {
  return `${productId}::${variantId || "base"}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const key = makeKey(item.productId, item.variantId);
        const qty = item.quantity ?? 1;
        if (qty <= 0) return { ok: false, error: "الكمية غير صحيحة" };
        if (item.maxStock <= 0) return { ok: false, error: "المنتج غير متوفر" };

        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          const nextQty = existing.quantity + qty;
          if (nextQty > item.maxStock && nextQty > existing.maxStock) {
            return {
              ok: false,
              error: `الكمية المتاحة فقط ${Math.max(item.maxStock, existing.maxStock)}`,
            };
          }
          set({
            items: get().items.map((i) =>
              i.key === key
                ? {
                    ...i,
                    quantity: Math.min(nextQty, Math.max(item.maxStock, existing.maxStock)),
                    maxStock: Math.max(item.maxStock, existing.maxStock),
                    unitPrice: item.unitPrice,
                    name: item.name,
                    image: item.image,
                  }
                : i
            ),
          });
          return { ok: true };
        }

        if (qty > item.maxStock) {
          return { ok: false, error: `الكمية المتاحة فقط ${item.maxStock}` };
        }

        set({
          items: [
            ...get().items,
            {
              key,
              productId: item.productId,
              variantId: item.variantId ?? null,
              name: item.name,
              image: item.image,
              size: item.size,
              color: item.color,
              unitPrice: item.unitPrice,
              quantity: qty,
              maxStock: item.maxStock,
            },
          ],
        });
        return { ok: true };
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return { ok: true };
        }
        const item = get().items.find((i) => i.key === key);
        if (!item) return { ok: false, error: "المنتج غير موجود في السلة" };
        if (quantity > item.maxStock) {
          return { ok: false, error: `الكمية المتاحة فقط ${item.maxStock}` };
        }
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity } : i
          ),
        });
        return { ok: true };
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => i.key !== key) });
      },

      clear: () => set({ items: [] }),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    }),
    {
      name: "elsharawy-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
