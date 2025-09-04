# 🛍️ Amader Bazar - Modern E-commerce Platform

A full-stack e-commerce platform built with Next.js 15, featuring admin dashboard, payment processing, and advanced product filtering.

## � Screenshots

![Amader Bazar Homepage](./public/home.png)

_Modern, responsive e-commerce storefront with featured products and clean design_

## �🚀 Features

### 🛒 Customer Features

- **Product Browsing** - Advanced filtering by category, price range, and sorting options
- **Shopping Cart** - Add/remove items with persistent state
- **Wishlist** - Save favorite products for later
- **Secure Checkout** - Stripe integration for payments
- **Order Tracking** - View order history and status
- **User Dashboard** - Profile management and order history

### 👨‍💼 Admin Features

- **Dashboard Overview** - Real-time sales analytics and metrics
- **Product Management** - CRUD operations with image uploads
- **Category Management** - Organize products into categories
- **Order Management** - View, update, and track orders
- **User Management** - Admin user oversight
- **Billboard Management** - Featured content management

### 🎨 Technical Features

- **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- **Real-time Updates** - Automatic data refresh and revalidation
- **Advanced Filtering** - Multi-criteria product search
- **Image Management** - UploadThing integration for file uploads
- **Authentication** - NextAuth with role-based access
- **Database** - Prisma ORM with MongoDB
- **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM and migrations
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication system
- **Server Actions** - Server-side data mutations

### Integrations

- **Stripe** - Payment processing
- **UploadThing** - File upload service
- **Vercel** - Deployment platform

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB database
- Stripe account
- UploadThing account

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/amader-bazar.git
   cd amader-bazar
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables (see Environment Variables section below)

4. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Visit application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your_mongodb_connection_string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Admin User (for initial setup)
ADMIN_EMAIL="admin@example.com"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# UploadThing
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS="GA_MEASUREMENT_ID"
```

## 📁 Project Structure

```
amader-bazar/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (public_store)/    # Public storefront
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── dashboard/         # User dashboard
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── product-listing/  # Product display components
│   └── dashboard/        # Dashboard-specific components
├── actions/              # Server actions
├── lib/                  # Utility functions
├── prisma/              # Database schema and migrations
├── schemas/             # Zod validation schemas
├── store/               # Client-side state management
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🎯 Key Components

### Product Filtering System

Advanced filtering with multiple criteria:

- **Category Filter** - Filter by product categories
- **Price Range** - Double-range slider for price selection
- **Sorting Options** - Name (A-Z, Z-A), Price, Date
- **New Products** - Show only recently added items
- **URL Persistence** - Filters persist in URL for sharing

### Admin Dashboard

Real-time analytics dashboard featuring:

- **Sales Metrics** - Revenue, orders, customer analytics
- **Interactive Charts** - Visual data representation
- **Auto-refresh** - Live data updates every 30 seconds
- **Quick Actions** - Direct links to management pages

### Shopping Cart & Wishlist

Persistent shopping experience:

- **Local Storage** - Cart persists across sessions
- **Wishlist Management** - Save items for later
- **Quantity Controls** - Easy item quantity updates
- **Price Calculations** - Real-time total updates

## 🔄 Database Schema

### Core Models

- **User** - Customer and admin accounts
- **Product** - Product catalog with images and pricing
- **Category** - Product categorization
- **Order** - Purchase transactions
- **OrderItem** - Individual order line items
- **Billboard** - Featured content management

### Relationships

```prisma
User (1:n) Order
Order (1:n) OrderItem
Product (1:n) OrderItem
Category (1:n) Product
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**

   ```bash
   npx vercel --prod
   ```

2. **Environment Variables**
   Add all environment variables in Vercel dashboard

3. **Domain Configuration**
   Set up custom domain in Vercel settings

### Database Deployment

- **MongoDB Atlas** - Recommended for production
- **PlanetScale** - Alternative with Prisma support

### Stripe Webhook Setup

1. Create webhook endpoint in Stripe dashboard
2. Point to: `https://amader-bazar.tajwar.app/api/webhooks/stripe`
3. Add webhook secret to environment variables

## 🛡️ Security

### Authentication

- **NextAuth.js** - Secure authentication system
- **Role-based Access** - Admin vs customer permissions
- **Session Management** - Secure session handling

### Data Validation

- **Zod Schemas** - Runtime type validation
- **Server Actions** - Secure server-side operations
- **Input Sanitization** - Protection against XSS

### Payment Security

- **Stripe Integration** - PCI-compliant payment processing
- **Webhook Verification** - Secure payment confirmations
- **Order Validation** - Secure order processing

## 📊 API Documentation

### Public Endpoints

- `GET /api/products` - Fetch products with filtering
- `GET /api/categories` - Get all categories
- `POST /api/webhooks/stripe` - Stripe payment webhooks

### Admin Endpoints (Protected)

- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/dashboard/analytics` - Dashboard metrics

### Server Actions

- `get-products` - Advanced product filtering
- `product.actions` - Product CRUD operations
- `order.actions` - Order management
- `user.actions` - User management

## 🧪 Testing

### Development Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build testing
npm run build
```

### Testing Strategy

- **Type Safety** - TypeScript compilation
- **Component Testing** - UI component validation
- **API Testing** - Server action validation
- **Integration Testing** - End-to-end workflows

## 🔧 Development

### Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:studio": "prisma studio"
}
```
