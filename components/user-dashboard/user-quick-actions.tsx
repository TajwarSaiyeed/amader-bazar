import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function UserQuickActions() {
  const quickActions = [
    {
      title: "Track Orders",
      description: "View all your orders",
      icon: Package,
      href: "/dashboard/orders",
      color: "text-blue-600",
    },
    {
      title: "Profile Settings",
      description: "Update your profile",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-purple-600",
    },
    {
      title: "Continue Shopping",
      description: "Browse our products",
      icon: ShoppingBag,
      href: "/products",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quickActions.map((action) => (
        <Card key={action.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Button
              asChild
              variant="ghost"
              className="w-full h-auto p-0 justify-start"
            >
              <Link href={action.href} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
