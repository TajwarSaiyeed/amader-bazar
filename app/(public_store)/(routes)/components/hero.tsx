'use client'

import * as React from "react"
import {FC} from "react"
import Autoplay from "embla-carousel-autoplay"
import {Carousel, CarouselContent, CarouselItem,} from "@/components/ui/carousel"


export interface BillboardProps {
    name: string
    image: string
}

type HeroProps = {
    billboards: BillboardProps[]
}
export const Hero: FC<HeroProps> = ({billboards}) => {
    const plugin = React.useRef(
        Autoplay({delay: 2000, stopOnInteraction: true})
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-7xl"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {billboards.map((_) => (
                    <CarouselItem key={_.image}>
                        <div
                            className={
                                "rounded-xl aspect-auto min-h-[300px] sm:aspect-[2.4/1] overflow-hidden bg-cover border"
                            }
                            style={{
                                backgroundImage: `url(${_.image})`,
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
