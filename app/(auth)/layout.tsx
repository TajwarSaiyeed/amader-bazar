import { ReactNode } from "react";
import { Metadata } from "next";
import MaxWidthWrapper from "@/components/max-width-wrapper";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper
      className={"flex justify-center items-center min-h-screen"}
    >
      {children}
    </MaxWidthWrapper>
  );
};

export const metadata: Metadata = {
  title: "Sign In",
  description: "Authentication forms built using the components.",
};

export default AuthLayout;
