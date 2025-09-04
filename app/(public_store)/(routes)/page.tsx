import MaxWidthWrapper from "@/components/max-width-wrapper";
import { BillboardProps, Hero } from "./components/hero";
import prisma from "@/lib/prisma";
import ProductReel from "@/components/product-reel";
import { getBrandNewProducts } from "@/actions/get-brand-new-products";
import { getProductsByCategory } from "@/actions/get-products-by-category";

export const revalidate = 10;

const HomePage = async () => {
  const billboards = await prisma.billboard.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const brandNewProducts = await getBrandNewProducts();
  const smartWatches = await getProductsByCategory(
    "65a7bb0730dfa553b116cf1c",
    4
  );

  const formattedBillboards: BillboardProps[] = billboards.map((billboard) => ({
    name: billboard.name,
    image: billboard.image,
  }));

  return (
    <MaxWidthWrapper>
      <Hero billboards={formattedBillboards} />
      <ProductReel
        title={"Brand New"}
        subtitle={"The latest and greatest from our store."}
        href={"/products"}
        data={brandNewProducts.products}
      />
      {smartWatches.products.length > 0 && (
        <ProductReel
          title={"Smart Watches"}
          subtitle={"The smartest watches on the market."}
          href={`/products?category=65a7bb0730dfa553b116cf1c`}
          data={smartWatches.products}
        />
      )}
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default HomePage;
