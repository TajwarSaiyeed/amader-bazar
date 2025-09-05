# 🗃️ Database Schema

## Overview

Amader Bazar uses MongoDB as the primary database with Prisma ORM for type-safe database operations. The schema is designed for an e-commerce platform with user management, product catalog, orders, and content management.

## Database Configuration

### Prisma Setup

**File**: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

### Connection Configuration

**File**: `lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Core Models

### 1. User Model

**Purpose**: User authentication and profile management

```prisma
model User {
  id            String    @id @default(cuid()) @map("_id")
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)

  // Authentication relations (NextAuth.js)
  accounts      Account[]
  sessions      Session[]

  // Business relations
  orders        Order[]
  wishlistItems WishlistItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

**Key Features**:

- Unique email constraint for authentication
- Role-based access control (USER/ADMIN)
- Soft deletion support via timestamps
- Integrated with NextAuth.js authentication

**Relationships**:

- One-to-many with `Order` (user can have multiple orders)
- One-to-many with `WishlistItem` (user's saved products)
- One-to-many with `Account` and `Session` (NextAuth.js)

### 2. Product Model

**Purpose**: Product catalog management

```prisma
model Product {
  id          String   @id @default(cuid()) @map("_id")
  name        String
  description String?
  price       Float
  images      String[]
  isFeatured  Boolean  @default(false)
  isArchived  Boolean  @default(false)

  // Relations
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  orderItems    OrderItem[]
  wishlistItems WishlistItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Features**:

- Multiple image support via array field
- Featured product system for homepage
- Soft deletion via `isArchived` flag
- Decimal price handling
- Full-text search capabilities

**Indexes**:

```prisma
// Recommended indexes for performance
@@index([categoryId])
@@index([isFeatured, isArchived])
@@index([name]) // For search functionality
@@index([createdAt]) // For sorting by newest
```

**Relationships**:

- Many-to-one with `Category`
- One-to-many with `OrderItem`
- One-to-many with `WishlistItem`

### 3. Category Model

**Purpose**: Product categorization system

```prisma
model Category {
  id        String    @id @default(cuid()) @map("_id")
  name      String    @unique
  slug      String    @unique

  // Relations
  products  Product[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Features**:

- Unique slug for SEO-friendly URLs
- Hierarchical structure support (can be extended)
- Cascade deletion protection (products must be moved first)

**Relationships**:

- One-to-many with `Product`

### 4. Order Model

**Purpose**: Order and transaction management

```prisma
model Order {
  id        String      @id @default(cuid()) @map("_id")
  userId    String
  status    OrderStatus @default(PENDING)
  total     Float

  // Customer information
  customerName  String
  customerEmail String
  customerPhone String
  address       String

  // Payment information
  stripePaymentIntentId String?

  // Relations
  user      User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

**Key Features**:

- Order status tracking system
- Stripe payment integration
- Customer contact information storage
- Order total calculation
- Audit trail with timestamps

**Relationships**:

- Many-to-one with `User`
- One-to-many with `OrderItem`

### 5. OrderItem Model

**Purpose**: Individual items within an order

```prisma
model OrderItem {
  id        String @id @default(cuid()) @map("_id")
  orderId   String
  productId String
  quantity  Int
  price     Float // Price at time of purchase

  // Relations
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([orderId, productId]) // Prevent duplicate products in same order
}
```

**Key Features**:

- Snapshot pricing (preserves price at purchase time)
- Quantity tracking
- Unique constraint prevents duplicate items
- Cascade delete with order

**Relationships**:

- Many-to-one with `Order` (cascade delete)
- Many-to-one with `Product`

### 6. WishlistItem Model

**Purpose**: User's saved products for later

```prisma
model WishlistItem {
  id        String @id @default(cuid()) @map("_id")
  userId    String
  productId String

  // Relations
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, productId]) // One wishlist item per user per product
}
```

**Key Features**:

- Unique constraint prevents duplicates
- Cascade delete with user and product
- Timestamp for wishlist analytics

**Relationships**:

- Many-to-one with `User` (cascade delete)
- Many-to-one with `Product` (cascade delete)

### 7. Billboard Model

**Purpose**: Homepage promotional banners

```prisma
model Billboard {
  id       String @id @default(cuid()) @map("_id")
  label    String
  imageUrl String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Features**:

- Simple content management for homepage
- Image URL storage (via UploadThing)
- Admin-controlled promotional content

## Authentication Models (NextAuth.js)

### Account Model

```prisma
model Account {
  id                String  @id @default(cuid()) @map("_id")
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### Session Model

```prisma
model Session {
  id           String   @id @default(cuid()) @map("_id")
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### VerificationToken Model

```prisma
model VerificationToken {
  id         String   @id @default(cuid()) @map("_id")
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Database Relationships Diagram

```
User (1) ←→ (M) Order
User (1) ←→ (M) WishlistItem
User (1) ←→ (M) Account
User (1) ←→ (M) Session

Category (1) ←→ (M) Product

Product (1) ←→ (M) OrderItem
Product (1) ←→ (M) WishlistItem

Order (1) ←→ (M) OrderItem
```

## Query Patterns

### 1. Product Queries

#### Get Products with Filtering

```typescript
// actions/get-products.ts
export async function getProducts(filters: ProductFilters) {
  const where: ProductWhereInput = {
    isArchived: false,
    isFeatured: filters.featured || undefined,
    categoryId: filters.categoryId || undefined,
    name: filters.name
      ? {
          contains: filters.name,
          mode: "insensitive",
        }
      : undefined,
    price: filters.priceRange
      ? {
          gte: filters.priceRange[0],
          lte: filters.priceRange[1],
        }
      : undefined,
  };

  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: getOrderBy(filters.sortBy),
    take: filters.limit,
    skip: filters.offset,
  });

  return products;
}
```

#### Get Product with Wishlist Status

```typescript
export async function getProductWithWishlist(
  productId: string,
  userId?: string
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      wishlistItems: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
      _count: {
        select: { orderItems: true },
      },
    },
  });

  return {
    ...product,
    isInWishlist: userId ? product?.wishlistItems.length > 0 : false,
    salesCount: product?._count.orderItems || 0,
  };
}
```

### 2. Order Queries

#### Get User Orders with Items

```typescript
export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
```

#### Get Order Details

```typescript
export async function getOrderDetails(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });
}
```

### 3. Analytics Queries

#### Dashboard Statistics

```typescript
export async function getDashboardStats() {
  const [totalUsers, totalProducts, totalOrders, totalRevenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}
```

#### Sales Analytics

```typescript
export async function getSalesAnalytics(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: { total: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startDate },
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "asc" },
  });
}
```

## Data Validation

### Prisma Schema Validation

```typescript
// Type-safe validation with Zod
import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  images: z.array(z.string().url()).min(1, "At least one image required"),
  categoryId: z.string().cuid("Invalid category ID"),
  isFeatured: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
```

### Database Constraints

```typescript
// Custom validation functions
export function validatePrice(price: number): boolean {
  return price > 0 && price < 1000000; // Max $1M
}

export function validateImageUrls(urls: string[]): boolean {
  return urls.length > 0 && urls.length <= 10; // Max 10 images
}

export function validateOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

## Performance Optimizations

### 1. Database Indexes

```typescript
// Recommended indexes for MongoDB
const indexes = [
  // Product search and filtering
  { categoryId: 1, isArchived: 1, isFeatured: 1 },
  { name: "text" }, // Full-text search
  { createdAt: -1 }, // Recent products first
  { price: 1 }, // Price range queries

  // User operations
  { email: 1 }, // Unique user lookup
  { userId: 1, createdAt: -1 }, // User's orders/wishlist

  // Order processing
  { status: 1, createdAt: -1 }, // Order status filtering
  { stripePaymentIntentId: 1 }, // Payment lookup
];
```

### 2. Query Optimization

```typescript
// Selective field inclusion
export async function getProductList() {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      images: { take: 1 }, // Only first image
      category: {
        select: { name: true },
      },
    },
    where: { isArchived: false },
  });
}

// Pagination for large datasets
export async function getProductsPaginated(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: offset,
      take: limit,
      where: { isArchived: false },
      include: { category: true },
    }),
    prisma.product.count({
      where: { isArchived: false },
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 3. Connection Pooling

```typescript
// Production Prisma configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
```

## Migration Management

### Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Reset database (development only)
npx prisma db push --force-reset

# Seed database
npx prisma db seed
```

### Seed Data

```typescript
// prisma/seed.ts
import { prisma } from "../lib/prisma";

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@amaderbazar.com" },
    update: {},
    create: {
      email: "admin@amaderbazar.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
    },
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: "Smartphone",
        description: "Latest smartphone with advanced features",
        price: 699.99,
        images: ["https://example.com/phone.jpg"],
        categoryId: electronics.id,
        isFeatured: true,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Backup and Recovery

### Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/amader-bazar"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$DATABASE_URL" --out="$BACKUP_DIR/$DATE"
```

### Data Recovery

```bash
# Restore from backup
mongorestore --uri="mongodb://..." /backup/20241201/

# Selective collection restore
mongorestore --uri="mongodb://..." --collection=products /backup/20241201/
```

## Security Considerations

### 1. Data Protection

- **Input Sanitization**: All user inputs validated with Zod schemas
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection
- **Access Control**: Row-level security through user relations
- **Sensitive Data**: Payment info stored securely with Stripe

### 2. Connection Security

```typescript
// Secure database connection
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL?.startsWith("mongodb+srv://")) {
  throw new Error("Database URL must use secure connection");
}
```

### 3. Environment Variables

```bash
# Required database environment variables
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/amaderbazar"

# Development vs Production
NODE_ENV="production" # Enables query logging in dev only
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**

   ```typescript
   // Increase timeout in Prisma client
   const prisma = new PrismaClient({
     datasources: {
       db: { url: process.env.DATABASE_URL + "?connect_timeout=60" },
     },
   });
   ```

2. **Large Query Performance**

   ```typescript
   // Use cursor-based pagination for large datasets
   const products = await prisma.product.findMany({
     take: 20,
     cursor: lastProductId ? { id: lastProductId } : undefined,
     orderBy: { id: "asc" },
   });
   ```

3. **Memory Issues**
   ```typescript
   // Stream large result sets
   const products = await prisma.product.findManyRaw({
     filter: { isArchived: false },
   });
   ```

### Debugging Queries

```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Duration: " + e.duration + "ms");
});
```
