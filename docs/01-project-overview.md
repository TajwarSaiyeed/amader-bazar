# 🏗️ Project Overview

## Architecture

Amader Bazar is a modern e-commerce platform built with Next.js 15 using the App Router architecture. The project follows a modular, scalable design with clear separation of concerns.

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Recharts** - Data visualization

### Backend

- **Next.js API Routes** - Server-side endpoints
- **Server Actions** - Direct server function calls
- **MongoDB** - NoSQL database
- **Prisma ORM** - Type-safe database client

### Authentication & Security

- **NextAuth.js v5** - Authentication solution
- **Google OAuth** - Social login provider
- **Role-based Access Control** - USER/ADMIN permissions
- **Rate Limiting** - API protection
- **Environment Validation** - Startup configuration checks

### External Services

- **Stripe** - Payment processing
- **UploadThing** - File upload service

### State Management

- **Zustand** - Lightweight state management
- **React Context** - Global state providers
- **Local Storage** - Client-side persistence

## Project Structure

```
amader-bazar/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── layout.tsx            # Auth layout
│   │   └── sign-in/              # Sign-in page
│   ├── (public_store)/           # Public storefront
│   │   ├── layout.tsx            # Public layout
│   │   └── (routes)/             # Public pages
│   │       ├── page.tsx          # Home page
│   │       ├── products/         # Product pages
│   │       ├── cart/             # Shopping cart
│   │       ├── about/            # About page
│   │       ├── contact/          # Contact page
│   │       └── help/             # Help center
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin overview
│   │   ├── overview/             # Dashboard analytics
│   │   ├── products/             # Product management
│   │   ├── categories/           # Category management
│   │   ├── orders/               # Order management
│   │   ├── users/                # User management
│   │   └── billboards/           # Billboard management
│   ├── dashboard/                # User dashboard
│   │   ├── layout.tsx            # User dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── orders/               # User orders
│   │   ├── wishlist/             # User wishlist
│   │   └── settings/             # User settings
│   ├── api/                      # API routes
│   │   ├── uploadthing/          # File upload endpoints
│   │   └── webhooks/             # Webhook handlers
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── actions/                      # Server actions
│   ├── billboard.actions.ts      # Billboard CRUD
│   ├── category.actions.ts       # Category CRUD
│   ├── product.actions.ts        # Product CRUD
│   ├── order.actions.ts          # Order management
│   ├── user.actions.ts           # User management
│   ├── wishlist.actions.ts       # Wishlist operations
│   ├── dashboard.actions.ts      # Admin analytics
│   ├── user-dashboard.actions.ts # User analytics
│   ├── get-products.ts           # Product fetching
│   ├── get-categories.ts         # Category fetching
│   └── stripe-checkout.ts        # Payment processing
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   ├── dashboard/                # Dashboard components
│   ├── product-listing/          # Product components
│   ├── product-reel/             # Product grid
│   ├── user-dashboard/           # User dashboard components
│   ├── site-header.tsx           # Main navigation
│   ├── footer.tsx                # Site footer
│   ├── error-boundary.tsx        # Error handling
│   └── [other components]
├── lib/                          # Utilities & config
│   ├── prisma.ts                 # Database client
│   ├── stripe.ts                 # Stripe configuration
│   ├── utils.ts                  # Utility functions
│   ├── env.ts                    # Environment validation
│   ├── logger.ts                 # Logging system
│   ├── rate-limit.ts             # Rate limiting
│   └── uploadthing.ts            # File upload config
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
├── providers/                    # React providers
│   ├── auth-provider.tsx         # Authentication
│   └── wishlist-provider.tsx     # Wishlist state
├── schemas/                      # Validation schemas
│   ├── product-schemas.ts        # Product validation
│   ├── category-schemas.ts       # Category validation
│   ├── billboard-schemas.ts      # Billboard validation
│   └── wishlist-schemas.ts       # Wishlist validation
├── store/                        # Client state
│   ├── use-cart.tsx              # Shopping cart store
│   └── useDebounce.tsx           # Debounce hook
├── types/                        # Type definitions
│   └── index.ts                  # Global types
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Mobile detection
│   └── use-debounced-filters.ts  # Filter debouncing
├── auth.config.ts                # NextAuth configuration
├── auth.ts                       # Auth instance
├── middleware.ts                 # Route protection
└── next-auth.d.ts                # Auth type extensions
```

## Core Principles

### 1. Type Safety

- Comprehensive TypeScript usage
- Prisma-generated types
- Zod schema validation
- No `any` types in production code

### 2. Performance

- Server-side rendering (SSR)
- Component memoization
- Optimized database queries
- Image optimization
- Caching strategies

### 3. Security

- Authentication & authorization
- Input validation & sanitization
- Rate limiting
- CSRF protection
- Environment variable validation

### 4. Scalability

- Modular component architecture
- Reusable server actions
- Optimized database queries
- Efficient state management

### 5. Developer Experience

- Comprehensive error handling
- Production logging
- Type-safe APIs
- Clear file organization
- Detailed documentation

## Development Workflow

1. **Feature Planning** - Define requirements and architecture
2. **Database Design** - Update Prisma schema if needed
3. **Component Development** - Build reusable UI components
4. **Server Actions** - Implement business logic
5. **Testing** - Write unit and integration tests
6. **Code Review** - Peer review process
7. **Deployment** - Automated CI/CD pipeline

## Key Design Decisions

### 1. App Router over Pages Router

- Better performance with Server Components
- Improved developer experience
- Built-in loading and error states
- Simplified data fetching

### 2. Server Actions over API Routes

- Type-safe client-server communication
- Reduced boilerplate code
- Automatic error handling
- Better developer experience

### 3. MongoDB over PostgreSQL

- Flexible schema for e-commerce data
- Better performance for document-based queries
- Easier horizontal scaling
- JSON-native data storage

### 4. Prisma over Raw Queries

- Type safety
- Database migrations
- Query optimization
- Developer productivity

### 5. Zustand over Redux

- Simpler API
- Better TypeScript support
- Smaller bundle size
- Less boilerplate
