import MaxWidthWrapper from "@/components/max-width-wrapper";
import { BillboardProps, Hero } from "./components/hero";
import prisma from "@/lib/prisma";
import ProductReel from "@/components/product-reel";
import BrandNewReel from "./components/brand-new-reel";
import CategoryReel from "./components/category-reel";
import { Suspense } from "react";

export const revalidate = 10;

const HomePage = async () => {
  const [billboards, categories, featuredCountsRaw] = await Promise.all([
    prisma.billboard.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.groupBy({
      by: ["categoryId"],
      where: { isFeatured: true },
      _count: { _all: true },
    }),
  ]);
  const featuredCounts = featuredCountsRaw as Array<{
    categoryId: string;
    _count: { _all: number };
  }>;

  const formattedBillboards: BillboardProps[] = billboards.map((billboard) => ({
    name: billboard.name,
    image: billboard.image,
  }));

  const eligibleCategoryIds = new Set(
    featuredCounts
      .filter((fc) => fc._count._all >= 4)
      .map((fc) => fc.categoryId)
  );
  const filteredCategories = categories.filter((c) =>
    eligibleCategoryIds.has(c.id)
  );

  return (
    <MaxWidthWrapper>
      <Hero billboards={formattedBillboards} />

      <Suspense
        fallback={
          <ProductReel
            title="Brand New"
            subtitle="The latest and greatest from our store."
            href="/products"
            data={[] as any}
            loading
            skeletonNumber={4}
          />
        }
      >
        <BrandNewReel />
      </Suspense>

      {filteredCategories.map((category) => (
        <Suspense
          key={category.id}
          fallback={
            <ProductReel
              title={category.name}
              subtitle={`Top picks in ${category.name}.`}
              href={`/products?category=${category.id}`}
              data={[] as any}
              loading
              skeletonNumber={4}
            />
          }
        >
          <CategoryReel category={category as any} limit={4} />
        </Suspense>
      ))}
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default HomePage;
