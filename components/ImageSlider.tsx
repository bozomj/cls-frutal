"use client";

import React, { useRef } from "react";

interface ImageItem {
  src: string;
}

interface ImageCarouselProps {
  images: ImageItem[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.querySelector("div")?.clientWidth || 0;
      //   const scrollAmount = itemWidth * 3; // avança 3 item por clique
      const scrollAmount =
        Math.floor(containerRef.current.offsetWidth / itemWidth) * itemWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      console.log(
        itemWidth,
        containerRef.current.offsetWidth,
        Math.floor(containerRef.current.offsetWidth / itemWidth),
        Math.floor(containerRef.current.offsetWidth / itemWidth) * itemWidth,
        ">>>" +
          ((Math.floor(containerRef.current.offsetWidth / itemWidth) *
            itemWidth) %
            containerRef.current.offsetWidth),

        containerRef.current.offsetWidth % itemWidth
      );
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-600/80 hover:bg-cyan-400 p-2 rounded-l-full shadow h-full cursor-pointer"
      >
        ◀
      </button>

      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar scroll-smooth "
      >
        {images.map((image) => (
          <div
            key={image.src}
            className="flex-shrink-0 px-1 w-1/2 sm:w-1/3 md:w-1/3 h-48 sm:h-60 md:h-72 rounded-lg overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src={image.src}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-600/80 hover:bg-cyan-400 p-2 rounded-r-full shadow h-full cursor-pointer"
      >
        ▶
      </button>
    </div>
  );
};

export default ImageCarousel;
