import ProductReel from "@/components/product-reel";
import { getBrandNewProducts } from "@/actions/get-brand-new-products";

export default async function BrandNewReel() {
  const { products } = await getBrandNewProducts();

  return (
    <ProductReel
      title="Brand New"
      subtitle="The latest and greatest from our store."
      href="/products"
      data={products}
    />
  );
}
