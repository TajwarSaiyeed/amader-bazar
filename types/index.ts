import { Category, Product, ProductImage } from "@/generated/prisma";

export interface IProductsProps {
  data: (Product & {
    category: Category;
    images: ProductImage[];
  })[];
}

export interface IProduct {
  product:
    | (Product & {
        category: Category;
        images: ProductImage[];
      })
    | null;
}
