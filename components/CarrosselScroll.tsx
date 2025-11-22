"use client";

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import PointIndicator from "./PointIndicator";
import utils from "@/utils";

interface CarrosselScrollProps {
  items: { url: string }[];
  time: number;
}

const CarrosselScroll: React.FC<CarrosselScrollProps> = ({ items, time }) => {
  const [index, setIndex] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const ref = scrollRef.current;
  const width = ref?.clientWidth;
  const max = width! * totalItems;

  const animado = useRef(false);

  function moveRight() {
    if (animado.current) return;
    animado.current = true;

    if (scrollRef.current) {
      const newIndex = index == 0 ? items.length - 1 : index - 1;
      setIndex(newIndex);

      ref?.scrollBy({ left: -width!, behavior: "smooth" });
      if (ref!.scrollLeft <= 0) {
        ref?.scrollBy({ left: max! });
        ref?.scrollBy({ left: -width!, behavior: "smooth" });
      }
    }
    setTimeout(() => (animado.current = false), time * 1000);
  }

  function moveLeft() {
    if (animado.current) return;
    animado.current = true;

    if (scrollRef.current) {
      const newIndex = index == items?.length - 1 ? 0 : index + 1;
      setIndex(newIndex);

      ref?.scrollBy({ left: width, behavior: "smooth" });
    }
    setTimeout(() => (animado.current = false), time * 1000);
  }

  useEffect(() => {
    let frames: NodeJS.Timeout;
    const animate = async () => {
      if (animado.current) return;
      // animado.current = true;
      frames = setTimeout(animate, time * 1000);
      moveLeft();
    };

    const handleScroll = () => {
      const atEnd = ref!.scrollLeft >= max - 2;

      if (atEnd) {
        ref!.style.scrollBehavior = "auto";
        ref!.scrollLeft = 0;

        requestAnimationFrame(() => {
          ref!.style.scrollBehavior = "smooth";
        });
      }
    };

    ref?.addEventListener("scroll", handleScroll);

    frames = setTimeout(animate, time * 1000);
    return () => clearTimeout(frames);
  });

  return (
    <div className="w-full h-[15rem] bg-green-200 rounded-2xl relative overflow-hidden shadow-sm shadow-gray-400 border">
      <ArrowButton direction="left" className={`left-0 `} onClick={moveLeft} />

      <div
        ref={scrollRef}
        className="flex  h-full overflow-hidden"
        onScrollEnd={() => {
          setTimeout(() => (animado.current = false), 300);
        }}
      >
        {items.map((e: { url: string }, key: number) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="min-w-full"
              key={key}
              src={utils.getUrlImage(e.url)}
              alt=""
            />
          );
        })}
        {/* repete a primeira imagem no final para dar ilusão de rolagem infinita */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="min-w-full"
          key={totalItems}
          src={utils.getUrlImage(items[0]?.url)}
          alt=""
        />
        ;
      </div>
      <ArrowButton
        className={`right-0 top-0 `}
        direction="right"
        onClick={moveRight}
      />

      <PointIndicator index={index} points={totalItems} />
    </div>
  );
};

interface ArrowButtonProps {
  direction: "left" | "right";
  className: string;
  onClick?: () => void;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  className,
  onClick,
}) => {
  return (
    <button
      className={`absolute h-full w-1/12 text-4xl cursor-pointer hover:text-5xl hover:bg-white/30 transition duration-500 ${className}`}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={direction === "left" ? faAngleLeft : faAngleRight}
      />
    </button>
  );
};

export default CarrosselScroll;
