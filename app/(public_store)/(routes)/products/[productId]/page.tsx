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
  params: Promise<{ productId: string }>;
}): Promise<Metadata> => {
  const { productId } = await params;
  const { product } = await getProduct(productId);

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
const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const { product } = await getProduct(productId);

  if (!product) {
    return redirect("/products");
  }

  const products = await getProductsByCategory(product.categoryId, 4);

  const images = product.images.map((image: { url: string }) => image.url);

  return (
    <MaxWidthWrapper>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* Image Slider - Left Side */}
          <div className="flex flex-col">
            <div className="aspect-square rounded-lg bg-gray-100">
              <ProductImageSlider images={images} next={true} previous={true} />
            </div>
          </div>

          {/* Product Details - Right Side */}
          <div className="mt-10 lg:mt-0">
            {/* Product Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Price and Category */}
            <div className="mb-6">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(product.price)}
                </p>
                <div className="ml-4 border-l border-gray-300 pl-4">
                  <span className="text-sm text-muted-foreground">
                    Category:{" "}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {product.category.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Description
              </h3>
              <div
                className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Delivery Info */}
            <div className="mb-8 flex items-center">
              <Check
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0 text-green-500"
              />
              <p className="ml-2 text-sm text-muted-foreground">
                Eligible for instant delivery
              </p>
            </div>

            {/* Add to Cart */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-16">
        <ProductReel
          href={`/products?category=${product.categoryId}`}
          title={`Similar ${product.category.name}`}
          subtitle={`Browse similar high-quality ${product.category.name} just like '${product.name}'`}
          data={products.products}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductPage;
