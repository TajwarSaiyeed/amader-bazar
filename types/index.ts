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

export type SortOption =
  | "newest"
  | "name-asc"
  | "name-desc"
  | "price-low-high"
  | "price-high-low";

export interface ProductWhereInput {
  isFeatured: boolean;
  isArchived: boolean;
  categoryId?: string;
  name?: {
    contains: string;
    mode?: "insensitive";
  };
  price?: {
    gte?: number;
    lte?: number;
  };
  createdAt?: {
    gte: Date;
  };
}

export interface ProductOrderByInput {
  name?: "asc" | "desc";
  price?: "asc" | "desc";
  createdAt?: "asc" | "desc";
}

// Auth types - simplified to match NextAuth types
export interface CustomUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: "USER" | "ADMIN";
}

export interface CustomSession {
  user: CustomUser;
  expires: string;
}
