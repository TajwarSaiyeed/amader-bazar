"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ProductImageSliderProps {
  images: string[];
  next?: boolean;
  previous?: boolean;
}

const ProductImageSlider = ({
  images,
  next = false,
  previous = false,
}: ProductImageSliderProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-2xl relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image} className={"w-full h-full"}>
            <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={`Product Image`}
                fill
                className={
                  "object-cover w-full h-full border border-zinc-100 rounded-xl"
                }
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {previous && (
        <CarouselPrevious
          className={"absolute top-[50%] -translate-y-[50%] left-5 z-40"}
        />
      )}
      {next && (
        <CarouselNext
          className={"absolute top-[50%] -translate-y-[50%] right-5 z-40"}
        />
      )}
    </Carousel>
  );
};

export default ProductImageSlider;
