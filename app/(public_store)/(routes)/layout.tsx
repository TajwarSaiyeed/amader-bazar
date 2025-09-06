import { ReactNode } from "react";
import { Metadata } from "next";
import Navbar from "./components/navbar";
import { MobileEnhancements } from "@/components/mobile-enhancements";

const StoreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <MobileEnhancements />
    </>
  );
};

export const metadata: Metadata = {
  title: "Amader Bazar",
  description: "Amader Bazar - Your Online Shopping Destination",
};

export default StoreLayout;
