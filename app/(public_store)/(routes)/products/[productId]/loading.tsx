import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProductDetailsSkeleton } from "./components/product-details-skeleton";

export default function ProductDetailsLoading() {
  return (
    <MaxWidthWrapper>
      <ProductDetailsSkeleton />
    </MaxWidthWrapper>
  );
}
