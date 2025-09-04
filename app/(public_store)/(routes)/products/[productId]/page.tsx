import ProductReel from "@/components/product-reel";
import { redirect } from "next/navigation";
import { getProductsByCategory } from "@/actions/get-products-by-category";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getProduct } from "@/actions/get-product";
import { Metadata } from "next";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import ProductImageSlider from "@/components/product-image-slider";
import AddToCartButton from "@/components/add-to-cart-button";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> => {
  const { product } = await getProduct(params.productId);

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
const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const { product } = await getProduct(params.productId);

  if (!product) {
    return redirect("/products");
  }

  const products = await getProductsByCategory(product.categoryId, 4);

  const images = product.images.map((image: { url: string }) => image.url);

  return (
    <MaxWidthWrapper>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          <div className={"mt-4"}>
            <h1
              className={
                "text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300 sm:text-4xl"
              }
            >
              {product.name}
            </h1>
          </div>

          <section className="mt-4">
            <div className="flex items-center">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {formatPrice(product.price)}
              </p>

              <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                {product.category.name}
              </div>
            </div>

            <div className="mt-4 space-y-6">
              <pre
                dangerouslySetInnerHTML={{ __html: product.description }}
                className={"text-muted-foreground text-[16px]"}
              />
            </div>

            <div className="mt-6 flex items-center">
              <Check
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-green-500"
              />
              <p className="ml-2 text-sm text-muted-foreground">
                Eligible for instant delivery
              </p>
            </div>
          </section>
        </div>
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-square rounded-lg">
            <ProductImageSlider images={images} next={true} previous={true} />
          </div>
        </div>
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <div className="mt-10">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      <ProductReel
        href={`/products?category=${product.categoryId}`}
        title={`Similar ${product.category.name}`}
        subtitle={`Browse similar high-quality ${product.category.name} just like '${product.name}'`}
        data={products.products}
      />
    </MaxWidthWrapper>
  );
};

export default ProductPage;
