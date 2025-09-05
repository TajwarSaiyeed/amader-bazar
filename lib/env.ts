/**
 * Environment variable validation
 * This ensures all required environment variables are present at startup
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "UPLOADTHING_TOKEN",
] as const;

type RequiredEnvVar = (typeof requiredEnvVars)[number];

function validateEnv() {
  const missing: RequiredEnvVar[] = [];
  const present: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else {
      present.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((envVar) => {
      console.error(`  - ${envVar}`);
    });
    console.error("\nPlease add these variables to your .env file");
    process.exit(1);
  }

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("✅ All required environment variables are present");
    console.log(`📝 Found ${present.length} required variables`);
  }
}

// Validate environment variables at startup
validateEnv();

// Export a typed environment object for type safety
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Auth
  AUTH_SECRET: process.env.AUTH_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  NODE_ENV: process.env.NODE_ENV || "development",

  // UploadThing
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN!,
} as const;

export default env;
