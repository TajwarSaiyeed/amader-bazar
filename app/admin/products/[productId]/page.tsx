import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProductForm } from "./components/product-form";
import prisma from "@/lib/prisma";
import { getAllCategories } from "@/actions/product.actions";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;

  let product;
  if (productId === "new") {
    product = null;
  } else {
    product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });
  }

  const categories = await getAllCategories();

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <ProductForm initialData={product} categories={categories} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default ProductPage;
