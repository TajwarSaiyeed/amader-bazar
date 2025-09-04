"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, CheckCircle, AlertCircle } from "lucide-react";
import { updateUserProfile } from "@/actions/user.actions";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfileFormProps {
  user: User;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const hasChanges = name.trim() !== (user.name || "").trim();
  const isFormValid = name.trim().length > 0 && name.trim().length <= 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate name
    if (!name.trim()) {
      setMessage({
        type: "error",
        text: "Name is required.",
      });
      setIsLoading(false);
      return;
    }

    if (name.trim().length > 100) {
      setMessage({
        type: "error",
        text: "Name must be less than 100 characters.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateUserProfile(name.trim());

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your profile has been successfully updated.",
        });
        toast.success("Profile updated successfully!");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update profile.",
        });
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Display */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Profile Picture (Read-only) */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Profile Photo</p>
              <p>Managed by your OAuth provider</p>
            </div>
          </div>

          {/* Name Field - Editable */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Clear message when user starts typing
                if (message) setMessage(null);
              }}
              placeholder="Enter your full name"
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              This is your display name that others will see.
            </p>
          </div>

          {/* Email Field - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed by your OAuth provider and cannot be changed
              here.
            </p>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={isLoading || !hasChanges || !isFormValid}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>

          {!hasChanges && (
            <p className="text-xs text-center text-muted-foreground">
              Make changes to your name to enable saving
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
