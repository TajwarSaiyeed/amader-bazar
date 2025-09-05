# 📚 Amader Bazar - Developer Documentation

This documentation is for developers working on the Amader Bazar e-commerce platform. It contains detailed technical information about the project architecture, features, and implementation details.

## 📑 Documentation Structure

- [**Project Overview**](./01-project-overview.md) - High-level architecture and tech stack
- [**Features Documentation**](./02-features.md) - Detailed feature breakdown
- [**Authentication & Authorization**](./03-auth.md) - User authentication and role-based access
- [**Database Schema**](./04-database.md) - Prisma schema and relationships
- [**API Reference**](./05-api.md) - Server actions and API

## 🚀 Quick Start for Developers

1. **Environment Setup**: Copy `.env.example` to `.env` and configure variables
2. **Database**: Run `npx prisma generate && npx prisma db push`
3. **Development**: Run `npm run dev` to start the development server
4. **Testing**: Run `npm test` to execute test suites

## 🏗️ Architecture Overview

```
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (public_store)/    # Public storefront
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes & webhooks
│   └── dashboard/         # User dashboard
├── actions/               # Server actions
├── components/            # Reusable UI components
├── lib/                   # Utilities & configurations
├── prisma/               # Database schema
├── providers/            # React context providers
└── types/                # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe
- **File Upload**: UploadThing
- **State Management**: Zustand + React Context
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts

## 📊 Key Metrics

- **Lines of Code**: ~15,000+
- **Components**: 50+ reusable components
- **Server Actions**: 40+ server-side functions
- **Database Models**: 8 core models
- **API Endpoints**: 10+ REST endpoints
- **Authentication**: Role-based (USER/ADMIN)

## 🔐 Security Features

- ✅ Environment variable validation
- ✅ Rate limiting on API routes
- ✅ CSRF protection via Next.js
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection with input sanitization
- ✅ Secure authentication with NextAuth.js
- ✅ Error boundaries for graceful error handling

## 📈 Performance Features

- ✅ Component memoization
- ✅ Database query optimization
- ✅ Image optimization with Next.js
- ✅ Selective data fetching
- ✅ Production logging system
- ✅ Caching strategies

---

⚠️ **Note**: This documentation is for internal development use only and should not be exposed to the public website.
