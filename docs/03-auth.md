# 🔐 Authentication & Authorization

## Overview

Amader Bazar uses NextAuth.js v5 (Auth.js) for secure authentication with Google OAuth integration and role-based authorization system.

## Authentication Flow

### 1. Authentication Configuration

**File**: `auth.config.ts`

```typescript
export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      // Protect dashboard routes
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      // Protect admin routes
      if (isOnAdmin) {
        if (isLoggedIn && auth.user.role === "ADMIN") return true;
        return false;
      }

      return true;
    },
  },
  providers: [], // Added during auth setup
} satisfies NextAuthConfig;
```

### 2. Main Authentication Setup

**File**: `auth.ts`

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
```

### 3. Middleware Protection

**File**: `middleware.ts`

```typescript
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Additional middleware logic if needed
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## User Roles & Permissions

### Role Types

```typescript
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
```

### Role-based Access Control

#### User Permissions (Role: USER)

- ✅ Browse products
- ✅ Add items to cart
- ✅ Manage wishlist
- ✅ Place orders
- ✅ View personal dashboard
- ✅ Update profile
- ❌ Access admin dashboard
- ❌ Manage products/categories
- ❌ View all users/orders

#### Admin Permissions (Role: ADMIN)

- ✅ All user permissions
- ✅ Access admin dashboard
- ✅ Manage products (CRUD)
- ✅ Manage categories (CRUD)
- ✅ Manage billboards (CRUD)
- ✅ View all orders
- ✅ View all users
- ✅ Update order status
- ✅ View analytics dashboard

### Route Protection Implementation

#### Public Routes

```typescript
// No authentication required
const publicRoutes = [
  "/",
  "/products",
  "/products/[id]",
  "/categories/[slug]",
  "/sign-in",
];
```

#### Protected User Routes

```typescript
// Requires authentication (any role)
const userRoutes = [
  "/dashboard",
  "/dashboard/orders",
  "/dashboard/wishlist",
  "/dashboard/settings",
];
```

#### Admin-only Routes

```typescript
// Requires ADMIN role
const adminRoutes = [
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/billboards",
  "/admin/orders",
  "/admin/users",
  "/admin/overview",
];
```

## Session Management

### Session Structure

```typescript
interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: "USER" | "ADMIN";
  };
}
```

### Getting Current Session

```typescript
import { auth } from "@/auth";

// In server components
export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    // Handle unauthenticated state
    return <LoginPrompt />;
  }

  // Access user data
  const { id, email, name, role } = session.user;
}

// In server actions
export async function serverAction() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Insufficient permissions");
  }
}
```

### Client-side Session Access

```typescript
"use client";
import { useSession } from "next-auth/react";

export function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <LoginButton />;

  return (
    <div>
      <p>Welcome, {session?.user?.name}</p>
      {session?.user?.role === "ADMIN" && <AdminPanel />}
    </div>
  );
}
```

## Authentication Components

### 1. Sign In Page

**Location**: `app/(auth)/sign-in/page.tsx`

```typescript
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            Access your Amader Bazar account
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <Button type="submit" className="w-full">
            <GoogleIcon className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
```

### 2. Auth Provider

**Location**: `providers/auth-provider.tsx`

```typescript
"use client";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 3. User Menu Component

```typescript
"use client";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session) return <LoginButton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>
              {session.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        {session.user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Panel</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Database Integration

### User Model

```prisma
model User {
  id            String    @id @default(cuid()) @map("_id")
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)

  // Relations
  accounts      Account[]
  sessions      Session[]
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

### Account & Session Models

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

model Session {
  id           String   @id @default(cuid()) @map("_id")
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Security Considerations

### 1. Environment Variables

Required authentication environment variables:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth.js
AUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000" # Production URL in prod
```

### 2. Session Security

- **JWT Strategy**: Sessions stored as encrypted JWTs
- **Secure Cookies**: HTTPOnly, Secure, SameSite cookies
- **Session Expiry**: Configurable session timeout
- **CSRF Protection**: Built-in CSRF protection

### 3. Route Protection

```typescript
// Server action security helper
async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user;
}

async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return user;
}

// Usage in server actions
export async function adminAction() {
  const user = await requireAdmin();
  // Proceed with admin operation
}
```

### 4. Client-side Protection

```typescript
// Custom hook for role-based access
export function useRequireAuth(requiredRole?: "ADMIN") {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const hasRequiredRole = requiredRole
    ? session?.user?.role === requiredRole
    : true;

  return {
    user: session?.user,
    isAuthenticated,
    hasRequiredRole,
    isLoading: status === "loading",
  };
}

// Usage in components
export function AdminComponent() {
  const { hasRequiredRole, isLoading } = useRequireAuth("ADMIN");

  if (isLoading) return <Loading />;
  if (!hasRequiredRole) return <AccessDenied />;

  return <AdminContent />;
}
```

## Error Handling

### Authentication Errors

```typescript
// Error pages configuration
export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/auth/error", // Custom error page
  },
  callbacks: {
    signIn({ user, account, profile }) {
      // Custom sign-in validation
      if (account?.provider === "google") {
        return true; // Allow Google sign-in
      }
      return false; // Deny other providers
    },
  },
};
```

### Error Boundaries

Authentication errors are handled by the global error boundary:

- Network errors during sign-in
- Session validation failures
- Permission denied scenarios
- OAuth provider errors

## Testing Authentication

### Unit Tests

```typescript
// Mock session for testing
export const mockSession = {
  user: {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: "USER" as const,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockAdminSession = {
  ...mockSession,
  user: { ...mockSession.user, role: "ADMIN" as const },
};
```

### Integration Tests

```typescript
describe("Authentication Flow", () => {
  it("should redirect unauthenticated users to sign-in", async () => {
    // Test unauthenticated access to protected route
  });

  it("should allow authenticated users to access dashboard", async () => {
    // Test authenticated user access
  });

  it("should prevent non-admin users from accessing admin routes", async () => {
    // Test role-based access control
  });
});
```

## Best Practices

### 1. Server Components

- Always use `await auth()` in server components
- Handle unauthenticated states gracefully
- Validate user permissions before sensitive operations

### 2. Client Components

- Use `useSession()` hook for client-side auth state
- Implement loading states for better UX
- Cache session data appropriately

### 3. API Routes

- Validate authentication in API routes
- Use consistent error responses
- Implement rate limiting for auth endpoints

### 4. Security

- Never expose sensitive user data to client
- Validate all user inputs
- Use TypeScript for type safety
- Regular security audits and updates
