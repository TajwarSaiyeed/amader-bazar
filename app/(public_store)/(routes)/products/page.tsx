import MaxWidthWrapper from "@/components/max-width-wrapper";
import ProductReel from "@/components/product-reel";
import { getProducts } from "@/actions/get-products";
import SearchBar from "../components/search-bar";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const ProductsPage = async ({ searchParams }: { searchParams?: string }) => {
  const params = new URLSearchParams(searchParams);
  const category = params.get("category");
  const name = params.get("name");
  const data = await getProducts(
    category ? category : undefined,
    undefined,
    name ? name : undefined
  );

  return (
    <MaxWidthWrapper>
      <SearchBar />
      <ProductReel
        title={"All Products"}
        data={data.products}
        subtitle={"All of our products."}
      />
    </MaxWidthWrapper>
  );
};

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our wide selection of products at Amader Bazar. Find everything you need in one place.",
};

export default ProductsPage;
