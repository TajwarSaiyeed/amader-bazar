"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  User,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/alert-modal";
import { deleteUser, updateUserRole } from "@/actions/user.actions";
import { UserWithDetails } from "@/types";

interface UserDetailsContentProps {
  user: UserWithDetails;
}

export function UserDetailsContent({ user }: UserDetailsContentProps) {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteUser(user.id);

      if (result.success) {
        toast.success("User deleted successfully");
        router.push("/admin/users");
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleteOpen(false);
      setLoading(false);
    }
  };

  const onUpdateRole = (newRole: "USER" | "ADMIN") => {
    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);

      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight">
                User Details
              </h2>
              <p className="text-muted-foreground">
                View and manage user information
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* User Info Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback className="text-lg">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Role</span>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Email Verified
                      </span>
                      <Badge
                        variant={user.emailVerified ? "default" : "destructive"}
                      >
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Joined{" "}
                        {format(new Date(user.createdAt), "MMMM do, yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {user.role === "USER" ? (
                      <Button
                        onClick={() => onUpdateRole("ADMIN")}
                        disabled={isPending}
                        className="w-full"
                        variant="outline"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onUpdateRole("USER")}
                        disabled={isPending}
                        className="w-full"
                        variant="outline"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Remove Admin
                      </Button>
                    )}

                    <Button
                      onClick={() => setDeleteOpen(true)}
                      variant="destructive"
                      className="w-full"
                    >
                      Delete User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics and Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user.orders?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lifetime orders placed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Wishlist Items
                    </CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user.wishlist?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Items in wishlist
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Spent
                    </CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ৳
                      {user.orders
                        ?.reduce(
                          (total: number, order) => total + order.total,
                          0
                        )
                        ?.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total amount spent
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders placed by this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              Order #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ৳{order.total.toLocaleString()}
                            </p>
                            <Badge variant="outline">
                              {order.OrderItem?.length || 0} items
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No orders found
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
