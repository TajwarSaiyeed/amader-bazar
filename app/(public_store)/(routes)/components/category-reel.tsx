import ProductReel from "@/components/product-reel";
import { getProductsByCategory } from "@/actions/get-products-by-category";
import type { Category } from "@/generated/prisma";

export default async function CategoryReel({
  category,
  limit = 4,
}: {
  category: Category;
  limit?: number;
}) {
  const { products } = await getProductsByCategory(category.id, limit);

  return (
    <ProductReel
      title={category.name}
      subtitle={`Top picks in ${category.name}.`}
      href={`/products?category=${category.id}`}
      data={products}
    />
  );
}
