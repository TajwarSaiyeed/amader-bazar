"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { IProductsProps } from "@/types";
import ProductListing from "@/components/product-listing";
import { Button } from "@/components/ui/button";

interface ProductReelProps extends IProductsProps {
  title: string;
  subtitle?: string;
  href?: string;
  loading?: boolean;
  skeletonNumber?: number;
}

const ProductReel = memo((props: ProductReelProps) => {
  const {
    title,
    subtitle,
    href,
    data,
    loading = false,
    skeletonNumber = 4,
  } = props;

  const [displayProducts, setDisplayProducts] = useState<
    IProductsProps["data"]
  >([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoize products calculation
  const products = useMemo(() => {
    if (!loading && data) {
      return data;
    } else {
      return new Array(skeletonNumber).fill(null);
    }
  }, [loading, data, skeletonNumber]);

  // Handle smooth transitions when products change
  useEffect(() => {
    if (products) {
      setIsTransitioning(true);

      // Small delay to allow fade-out animation
      const timer = setTimeout(() => {
        setDisplayProducts(products);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [products]);

  // Initialize display products on first render
  useEffect(() => {
    if (products && displayProducts.length === 0) {
      setDisplayProducts(products);
    }
  }, [products, displayProducts.length]);

  // Memoize grid class
  const gridClassName = useMemo(
    () =>
      `w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 transition-all duration-300 ease-in-out ${
        isTransitioning
          ? "opacity-60 transform scale-[0.98]"
          : "opacity-100 transform scale-100"
      }`,
    [isTransitioning]
  );

  return (
    <section className={"py-12"}>
      <div className={"md:flex md:items-center md:justify-between mb-4"}>
        <div className={"max-w-2xl px-4 lg:max-w-4xl lg:px-0"}>
          {title ? (
            <h1
              className={
                "text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-200 capitalize"
              }
            >
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className={"mt-2 text-sm text-muted-foreground"}>{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className={
              "hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
            }
          >
            Shop the collection <span aria-hidden={true}>&rarr;</span>
          </Link>
        ) : null}
      </div>

      {/* Mobile "View All" Button */}
      {href && (
        <div className="md:hidden mb-6 px-4 lg:px-0">
          <Link href={href} className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-primary border-primary hover:bg-primary hover:text-white"
            >
              View All {title || "Products"}
              <span aria-hidden={true} className="ml-1">
                &rarr;
              </span>
            </Button>
          </Link>
        </div>
      )}
      <div className={"relative"}>
        <div className={"mt-6 flex items-center w-full"}>
          <div className={gridClassName}>
            {displayProducts.map((product, i) => (
              <div
                key={`${product?.id || i}-${i}`}
                className="transition-all duration-200 ease-in-out"
              >
                <ProductListing index={i} product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ProductReel.displayName = "ProductReel";

export default ProductReel;
