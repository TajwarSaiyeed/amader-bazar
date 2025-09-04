import {
  Category,
  Product,
  ProductImage,
  User,
  Order,
  OrderItem,
  Wishlist,
} from "@/generated/prisma";

export interface IProductsProps {
  data: (Product & {
    category: Category;
    images: ProductImage[];
    isInWishlist?: boolean;
  })[];
}

export interface IProduct {
  product:
    | (Product & {
        category: Category;
        images: ProductImage[];
        isInWishlist?: boolean;
      })
    | null;
}

export interface UserWithDetails extends User {
  orders: (Order & {
    OrderItem?: (OrderItem & {
      product: Product;
    })[];
  })[];
  wishlist: (Wishlist & {
    product: Product & {
      images: ProductImage[];
    };
  })[];
}
