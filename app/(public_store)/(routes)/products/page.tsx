import MaxWidthWrapper from "@/components/max-width-wrapper";
import ProductReel from "@/components/product-reel";
import { getProductsWithFilters } from "@/actions/get-products";
import { getCategories } from "@/actions/get-categories";
import SearchBar from "../components/search-bar";
import ProductFilters from "@/components/product-filters";
import QuickFilters from "@/components/quick-filters";
import { Metadata } from "next";
import type { SortOption } from "@/types";

export const dynamic = "force-dynamic";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;

  // Extract all filter parameters
  const categoryId = resolvedSearchParams?.category as string | undefined;
  const name = resolvedSearchParams?.name as string | undefined;
  const minPriceParam = resolvedSearchParams?.minPrice as string | undefined;
  const maxPriceParam = resolvedSearchParams?.maxPrice as string | undefined;
  const sort = resolvedSearchParams?.sort as SortOption | undefined;
  const newOnlyParam = resolvedSearchParams?.newOnly as string | undefined;

  // Parse numeric parameters
  const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
  const newOnly = newOnlyParam === "true";

  // Fetch data
  const [productsResult, categoriesResult] = await Promise.all([
    getProductsWithFilters({
      categoryId,
      name,
      minPrice,
      maxPrice,
      sort,
      newOnly,
    }),
    getCategories(),
  ]);

  const { products } = productsResult;
  const { categories } = categoriesResult;

  // Build title based on active filters
  let title = "All Products";
  if (categoryId && categories.length > 0) {
    const category = categories.find((c) => c.id === categoryId);
    title = category ? `${category.name} Products` : "All Products";
  }
  if (name) {
    title = `Search Results for "${name}"`;
  }

  // Build subtitle with filter info
  let subtitle = "Browse our wide selection of products.";
  const activeFilters = [];
  if (minPrice !== undefined) activeFilters.push(`Min: $${minPrice}`);
  if (maxPrice !== undefined) activeFilters.push(`Max: $${maxPrice}`);
  if (newOnly) activeFilters.push("New products only");
  if (sort && sort !== "newest") {
    const sortLabels = {
      "name-asc": "A to Z",
      "name-desc": "Z to A",
      "price-low-high": "Price: Low to High",
      "price-high-low": "Price: High to Low",
    };
    activeFilters.push(
      `Sorted by ${sortLabels[sort as keyof typeof sortLabels]}`
    );
  }

  if (activeFilters.length > 0) {
    subtitle = `${
      products.length
    } products found. Filters: ${activeFilters.join(", ")}`;
  } else {
    subtitle = `${products.length} products available.`;
  }

  return (
    <MaxWidthWrapper>
      {/* Page Header */}
      <div className="py-8 space-y-6">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Discover Products
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for with our advanced search
            and filtering options
          </p>
        </div>

        {/* Search Bar - Centered and Prominent */}
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-4">
        <ProductFilters categories={categories} />
        <QuickFilters categories={categories} />
      </div>

      {/* Results Section */}
      <ProductReel title={title} data={products} subtitle={subtitle} />
    </MaxWidthWrapper>
  );
};

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our wide selection of products at Amader Bazar. Find everything you need in one place with advanced filtering options.",
};

export default ProductsPage;
