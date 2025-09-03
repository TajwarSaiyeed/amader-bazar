"use client";
import Link from "next/link";
import { UserAuthForm } from "./components/user-auth-from";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import Image from "next/image";

export default function AuthenticationPage() {
  const session = useSession();

  if (session.status === "loading") {
    return <PuffLoader color={"blue"} size={150} />;
  }

  if (session.status === "authenticated") {
    toast.success("Successfully authenticated", {
      duration: 5000,
      position: "top-right",
      style: {
        backgroundColor: "#10B981",
        color: "#fff",
      },
      description: "You are being redirected to the dashboard.",
    });
    return redirect("/admin/overview");
  }

  return (
    <div className="lg:p-8">
      <div className={"flex justify-center items-center"}>
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Amader Bazar" width={200} height={200} />
        </Link>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in with Google
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your Google account to continue
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
