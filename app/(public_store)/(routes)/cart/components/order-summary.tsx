"use client";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useCart } from "@/store/use-cart";
import type { CartItem } from "@/store/use-cart";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostCodeCombobox } from "@/app/(public_store)/(routes)/cart/components/post-code-combobox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { placeOrder as placeOrderAction } from "@/actions/place-order";

export const OrderSummary = () => {
  const { data } = useSession();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [orderDetails, setOrderDetails] = useState({
    transactionId: "",
    address: "",
    postCode: "",
    phoneNumber: "",
  });

  const cartTotal = items.reduce(
    (total: number, item: CartItem) => total + item.price,
    0
  );

  const orderItems = items.map((product: CartItem) => product.id);

  const placeOrder = async () => {
    try {
      const { transactionId, address, postCode } = orderDetails;

      if (!transactionId || !address || !postCode) {
        return toast.error("Please fill all the fields");
      }

      setIsLoading(true);
      await placeOrderAction({
        ...orderDetails,
        orderItems,
        total: cartTotal,
      });

      toast.success("Order placed successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
      clearCart();
      setOrderDetails({
        transactionId: "",
        address: "",
        postCode: "",
        phoneNumber: "",
      });
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <section className="mt-16 rounded-lg bg-gray-100 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
        <div className={"w-full"}>
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-sm font-medium text-gray-900">
                {isMounted ? (
                  formatPrice(cartTotal)
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </p>
            </div>

            {/* Transaction fee removed */}

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-base font-medium text-gray-900">
                Order Total
              </div>
              <div className="text-base font-medium text-gray-900">
                {isMounted ? (
                  formatPrice(cartTotal)
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          <div className={"my-4 space-y-8"}>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                placeholder={"ACB2EFFACE100"}
                disabled={isLoading}
                className={"w-full"}
                id={"transactionId"}
                value={orderDetails.transactionId}
                onChange={handleInputChange}
              />
              <span className={"text-muted-foreground text-[12px]"}>
                আপনার বিকাশের টাকা পাঠানোর সময় যে ট্রানজেকশন আইডি পাবেন সেটা
                এখানে দিন।
              </span>
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                placeholder="eg. 017XXXXXXXX"
                disabled={isLoading}
                className={"w-full"}
                id={"phoneNumber"}
                value={orderDetails.phoneNumber}
                onChange={handleInputChange}
              />
              <span className={"text-muted-foreground text-[12px]"}>
                আপনার ফোন নাম্বার দিন।
              </span>
            </div>

            {/*Postal Code*/}

            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label>Post Code</Label>

              <PostCodeCombobox
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
              />
              <span className={"text-muted-foreground text-[12px]"}>
                আপনার পোস্টাল কোড দিন।
              </span>
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea
                placeholder="eg. 4397 Padua, Lohagara, Chittagong"
                className={"w-full"}
                id={"address"}
                value={orderDetails.address}
                onChange={handleInputChange}
              />
              <span className={"text-muted-foreground text-[12px]"}>
                আপনার ঠিকানা দিন। যেমনঃ 4397 পদুয়া, লোহাগাড়া, চট্টগ্রাম।
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              disabled={
                isLoading ||
                !isMounted ||
                !data?.user ||
                !orderItems.length ||
                !cartTotal ||
                !orderDetails.transactionId ||
                !orderDetails.address ||
                !orderDetails.postCode ||
                !orderDetails.phoneNumber
              }
              type="submit"
              className="w-full"
              size="lg"
              onClick={placeOrder}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Order Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
