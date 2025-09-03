import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getAllProducts } from "@/actions/product.actions";
import { dateFormatted, formatter } from "@/lib/utils";
import { ProductClient, ProductColumn } from "./components";

export const revalidate = 0;

const ProductsPage = async () => {
  const products = await getAllProducts();

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price),
    category: product.category.name,
    createdAt: dateFormatted(product.createdAt),
  }));

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <ProductClient data={formattedProducts} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default ProductsPage;
