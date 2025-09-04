import { Suspense } from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getProduct } from "@/actions/get-product";
import { Metadata } from "next";
import { ProductDetailsContent } from "./components/product-details-content";
import { ProductDetailsSkeleton } from "./components/product-details-skeleton";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> => {
  const { productId } = await params;
  const { product } = await getProduct(productId);

  if (!product) {
    return {
      title: "Amader Bazar | Product Not Found",
      description: "Amader Bazar is an online store for all your needs.",
    };
  }
  return {
    title: product.name,
    description: "Amader Bazar is an online store for all your needs.",
  };
};
const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  return (
    <MaxWidthWrapper>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetailsContent productId={productId} />
      </Suspense>
    </MaxWidthWrapper>
  );
};

export default ProductPage;
