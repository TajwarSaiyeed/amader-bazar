import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product, Category, ProductImage } from "@/generated/prisma";

export type CartItem = Product & { category: Category; images: ProductImage[] };

type CartState = {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => ({
          items: [...state.items, product],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clearCart: () =>
        set(() => ({
          items: [],
        })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
