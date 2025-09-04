import { Suspense } from "react";
import { getUserProfile } from "@/actions/user-dashboard.actions";
import { Heading } from "@/components/heading";
import { UserProfileForm } from "@/components/user-dashboard/user-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function UserSettingsContent() {
  const user = await getUserProfile();

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Unable to load user profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <Heading
        title="Profile Settings"
        description="Manage your account information and preferences"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <UserProfileForm user={user} />

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Member Since
              </p>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Account ID
              </p>
              <p className="text-sm font-mono">{user.id.slice(-12)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UserSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col space-y-6">
          <Heading
            title="Profile Settings"
            description="Loading your settings..."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-full bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <UserSettingsContent />
    </Suspense>
  );
}
