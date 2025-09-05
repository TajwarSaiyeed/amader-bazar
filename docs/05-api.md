# 🛠️ API Reference

## Overview

Amader Bazar uses Next.js 15 App Router with Server Actions for type-safe API operations. The API layer consists of Server Actions for data mutations and API routes for webhooks and external integrations.

## Server Actions

Server Actions provide type-safe, server-side functions that can be called directly from React components without traditional API routes.

### 1. Product Actions

**File**: `actions/product.actions.ts`

#### Create Product

```typescript
export async function createProduct(input: CreateProductInput) {
  // Validate user permissions
  const user = await requireAdmin();

  // Validate input data
  const validatedInput = CreateProductSchema.parse(input);

  try {
    const product = await prisma.product.create({
      data: {
        ...validatedInput,
        images: validatedInput.images.filter(Boolean), // Remove empty strings
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    // Revalidate cache
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, product };
  } catch (error) {
    logger.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}
```

#### Update Product

```typescript
export async function updateProduct(id: string, input: UpdateProductInput) {
  const user = await requireAdmin();
  const validatedInput = UpdateProductSchema.parse(input);

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { success: false, error: "Product not found" };
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedInput,
      include: {
        category: true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`);

    return { success: true, product };
  } catch (error) {
    logger.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}
```

#### Delete Product

```typescript
export async function deleteProduct(id: string) {
  const user = await requireAdmin();

  try {
    // Check for existing orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (orderItems) {
      // Soft delete - archive instead of delete
      await prisma.product.update({
        where: { id },
        data: { isArchived: true },
      });
    } else {
      // Hard delete if no orders exist
      await prisma.product.delete({
        where: { id },
      });
    }

    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    logger.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
```

#### Get Products with Filters

```typescript
export async function getProducts(filters: ProductFilters = {}) {
  try {
    const where: ProductWhereInput = {
      isArchived: false,
      isFeatured: filters.featured || undefined,
      categoryId: filters.categoryId || undefined,
    };

    // Name search
    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: "insensitive",
      };
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      where.price = {
        gte: filters.priceRange[0],
        lte: filters.priceRange[1],
      };
    }

    // New products filter (last 30 days)
    if (filters.isNew) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.createdAt = { gte: thirtyDaysAgo };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: getProductOrderBy(filters.sortBy),
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    return products.map((product) => ({
      ...product,
      salesCount: product._count.orderItems,
    }));
  } catch (error) {
    logger.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products");
  }
}
```

### 2. Category Actions

**File**: `actions/category.actions.ts`

#### Create Category

```typescript
export async function createCategory(input: CreateCategoryInput) {
  const user = await requireAdmin();
  const validatedInput = CreateCategorySchema.parse(input);

  try {
    // Generate slug from name
    const slug = generateSlug(validatedInput.name);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        success: false,
        error: "Category with this name already exists",
      };
    }

    const category = await prisma.category.create({
      data: {
        ...validatedInput,
        slug,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    logger.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}
```

#### Get Categories

```typescript
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { isArchived: false },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    logger.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
```

### 3. Order Actions

**File**: `actions/order.actions.ts`

#### Create Order

```typescript
export async function createOrder(input: CreateOrderInput) {
  const user = await requireAuth();
  const validatedInput = CreateOrderSchema.parse(input);

  try {
    // Calculate total from cart items
    const cartItems = validatedInput.items;
    let total = 0;

    // Validate products and calculate total
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.isArchived) {
        return {
          success: false,
          error: `Product ${item.productId} not available`,
        };
      }

      total += product.price * item.quantity;
    }

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: user.id,
          total,
          customerName: validatedInput.customerName,
          customerEmail: validatedInput.customerEmail,
          customerPhone: validatedInput.customerPhone,
          address: validatedInput.address,
          status: "PENDING",
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price, // Price at time of purchase
        })),
      });

      return createdOrder;
    });

    revalidatePath("/dashboard/orders");

    return { success: true, order };
  } catch (error) {
    logger.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order" };
  }
}
```

#### Update Order Status

```typescript
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const user = await requireAdmin();

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: { email: true, name: true },
        },
        orderItems: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Send email notification (if implemented)
    // await sendOrderStatusEmail(order);

    revalidatePath("/admin/orders");
    revalidatePath("/dashboard/orders");

    return { success: true, order };
  } catch (error) {
    logger.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
```

### 4. Wishlist Actions

**File**: `actions/wishlist.actions.ts`

#### Toggle Wishlist

```typescript
export async function toggleWishlist(productId: string) {
  const user = await requireAuth();

  try {
    // Check if item exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });

      return { success: true, action: "removed" };
    } else {
      // Add to wishlist
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          productId,
        },
      });

      return { success: true, action: "added" };
    }
  } catch (error) {
    logger.error("Failed to toggle wishlist:", error);
    return { success: false, error: "Failed to update wishlist" };
  } finally {
    revalidatePath("/dashboard/wishlist");
    revalidatePath(`/products/${productId}`);
  }
}
```

#### Get User Wishlist

```typescript
export async function getUserWishlist() {
  const user = await requireAuth();

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return wishlistItems.map((item) => item.product);
  } catch (error) {
    logger.error("Failed to fetch wishlist:", error);
    throw new Error("Failed to fetch wishlist");
  }
}
```

### 5. User Actions

**File**: `actions/user.actions.ts`

#### Update User Profile

```typescript
export async function updateUserProfile(input: UpdateUserProfileInput) {
  const user = await requireAuth();
  const validatedInput = UpdateUserProfileSchema.parse(input);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedInput.name,
        // Email updates require verification
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    revalidatePath("/dashboard/settings");

    return { success: true, user: updatedUser };
  } catch (error) {
    logger.error("Failed to update user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
```

### 6. Dashboard Actions

**File**: `actions/dashboard.actions.ts`

#### Get Dashboard Data

```typescript
export async function getDashboardData() {
  const user = await requireAdmin();

  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      chartData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
          _count: {
            select: { orderItems: true },
          },
        },
      }),
      getChartData(),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      chartData,
    };
  } catch (error) {
    logger.error("Failed to fetch dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}
```

#### Get Chart Data

```typescript
async function getChartData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { not: "CANCELLED" },
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

  // Group by date
  const dailyData = orders.reduce((acc, order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { date, orders: 0, revenue: 0 };
    }
    acc[date].orders += 1;
    acc[date].revenue += order.total;
    return acc;
  }, {} as Record<string, { date: string; orders: number; revenue: number }>);

  return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
}
```

## API Routes

### 1. NextAuth API Route

**File**: `app/api/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

### 2. UploadThing API Route

**File**: `app/api/uploadthing/route.ts`

```typescript
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

### 3. Stripe Webhooks

**File**: `app/api/webhooks/stripe/route.ts`

```typescript
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    logger.error("Stripe webhook error:", error);
    return new Response("Webhook error", { status: 400 });
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    // Update order status
    await prisma.order.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: "PROCESSING" },
    });

    // Send confirmation email
    // await sendOrderConfirmationEmail(order);
  } catch (error) {
    logger.error("Failed to handle payment success:", error);
  }
}
```

## Data Fetching Patterns

### 1. Server Components

```typescript
// Direct database access in server components
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Client Components with Server Actions

```typescript
"use client";
import { useState, useTransition } from "react";
import { createProduct } from "@/actions/product.actions";

export function CreateProductForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createProduct({
        name: formData.get("name") as string,
        price: Number(formData.get("price")),
        // ... other fields
      });
      setResult(result);
    });
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Product"}
      </button>
      {result && !result.success && (
        <p className="text-red-500">{result.error}</p>
      )}
    </form>
  );
}
```

### 3. Optimistic Updates

```typescript
"use client";
import { useOptimistic } from "react";
import { toggleWishlist } from "@/actions/wishlist.actions";

export function WishlistButton({ productId, initialIsInWishlist }: Props) {
  const [optimisticIsInWishlist, setOptimisticIsInWishlist] = useOptimistic(
    initialIsInWishlist,
    (current) => !current
  );

  const handleToggle = async () => {
    setOptimisticIsInWishlist(!optimisticIsInWishlist);

    try {
      const result = await toggleWishlist(productId);
      if (!result.success) {
        // Revert optimistic update on error
        setOptimisticIsInWishlist(optimisticIsInWishlist);
      }
    } catch (error) {
      setOptimisticIsInWishlist(optimisticIsInWishlist);
    }
  };

  return (
    <button onClick={handleToggle}>
      {optimisticIsInWishlist ? "❤️" : "🤍"}
    </button>
  );
}
```

## Error Handling

### 1. Server Action Error Handling

```typescript
export async function createProduct(input: CreateProductInput) {
  try {
    // Validate permissions
    const user = await requireAdmin();

    // Validate input
    const validatedInput = CreateProductSchema.parse(input);

    // Business logic
    const product = await prisma.product.create({
      data: validatedInput,
    });

    revalidatePath("/admin/products");

    return { success: true, product };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Unauthorized access",
      };
    }

    logger.error("Product creation failed:", error);
    return {
      success: false,
      error: "Failed to create product",
    };
  }
}
```

### 2. API Route Error Handling

```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Process request
    const result = await processData(data);

    return Response.json({ success: true, data: result });
  } catch (error) {
    logger.error("API error:", error);

    if (error instanceof ValidationError) {
      return Response.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Performance Optimizations

### 1. Caching Strategies

```typescript
import { unstable_cache } from "next/cache";

// Cache expensive queries
export const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  },
  ["categories"],
  { revalidate: 3600 } // 1 hour
);

// Cache with dynamic keys
export const getCachedProduct = unstable_cache(
  async (productId: string) => {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  },
  ["product"],
  { revalidate: 300 } // 5 minutes
);
```

### 2. Parallel Queries

```typescript
export async function getProductPageData(productId: string, userId?: string) {
  const [product, relatedProducts, userWishlist] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    }),
    prisma.product.findMany({
      where: {
        categoryId: product?.categoryId,
        id: { not: productId },
        isArchived: false,
      },
      take: 4,
    }),
    userId ? getUserWishlist(userId) : null,
  ]);

  return { product, relatedProducts, userWishlist };
}
```

### 3. Selective Field Queries

```typescript
// Only fetch needed fields
export async function getProductList() {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      images: { take: 1 }, // Only first image
      category: {
        select: { name: true, slug: true },
      },
    },
    where: { isArchived: false },
  });
}
```

## Testing

### 1. Server Action Testing

```typescript
import { describe, it, expect, vi } from "vitest";
import { createProduct } from "@/actions/product.actions";

// Mock dependencies
vi.mock("@/auth", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: "admin-id", role: "ADMIN" }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      create: vi.fn(),
    },
  },
}));

describe("createProduct", () => {
  it("should create product successfully", async () => {
    const mockProduct = {
      id: "product-id",
      name: "Test Product",
      price: 99.99,
    };

    prisma.product.create.mockResolvedValue(mockProduct);

    const result = await createProduct({
      name: "Test Product",
      price: 99.99,
      categoryId: "category-id",
      images: ["image1.jpg"],
    });

    expect(result.success).toBe(true);
    expect(result.product).toEqual(mockProduct);
  });

  it("should handle validation errors", async () => {
    const result = await createProduct({
      name: "", // Invalid: empty name
      price: -10, // Invalid: negative price
      categoryId: "category-id",
      images: [],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid input data");
  });
});
```

### 2. API Route Testing

```typescript
import { POST } from "@/app/api/webhooks/stripe/route";

describe("/api/webhooks/stripe", () => {
  it("should handle payment success webhook", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/webhooks/stripe",
      {
        method: "POST",
        headers: {
          "stripe-signature": "valid-signature",
        },
        body: JSON.stringify({
          type: "payment_intent.succeeded",
          data: { object: { id: "pi_test" } },
        }),
      }
    );

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
  });
});
```

## Rate Limiting

### 1. API Rate Limiting

```typescript
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Apply rate limiting
  const { success, limit, remaining, reset } = await rateLimit.check(
    "api_create_product",
    request.ip || "anonymous"
  );

  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  // Process request
  // ...
}
```

### 2. Server Action Rate Limiting

```typescript
export async function createProduct(input: CreateProductInput) {
  const user = await requireAdmin();

  // Rate limit per user
  const { success } = await rateLimit.check("create_product", user.id);

  if (!success) {
    return {
      success: false,
      error: "Too many requests. Please try again later.",
    };
  }

  // Continue with product creation
  // ...
}
```

## Documentation and Types

### 1. API Response Types

```typescript
// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Server action response types
export type CreateProductResponse = ApiResponse<{
  product: ProductWithCategory;
}>;

export type UpdateProductResponse = ApiResponse<{
  product: ProductWithCategory;
}>;

export type DeleteProductResponse = ApiResponse<{}>;
```

### 2. Input Validation Schemas

```typescript
import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1).max(10),
  categoryId: z.string().cuid(),
  isFeatured: z.boolean().default(false),
});

export const ProductFiltersSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  sortBy: z
    .enum([
      "newest",
      "oldest",
      "price-asc",
      "price-desc",
      "name-asc",
      "name-desc",
    ])
    .optional(),
  featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});
```
