import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/user-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Prevent admin users from accessing user dashboard
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
