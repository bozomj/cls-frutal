"use client";

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import PointIndicator from "./PointIndicator";

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

  async function moveRight() {
    if (animado) return;
    animado = true;

    if (scrollRef.current) {
      ref?.scrollBy({ left: -width!, behavior: "smooth" });

      const newIndex = index == 0 ? items.length - 1 : index - 1;
      setIndex(newIndex);

      if (ref!.scrollLeft == 0) {
        ref?.scrollBy({ left: max! });
        ref?.scrollBy({ left: -width!, behavior: "smooth" });
      }
    }
  }

  async function moveLeft() {
    if (animado) return;
    animado = true;

    if (scrollRef.current) {
      ref?.scrollBy({ left: width, behavior: "smooth" });
      const newIndex = index == items?.length - 1 ? 0 : index + 1;

      setIndex(newIndex);

      if (ref!.scrollLeft >= max) {
        ref?.scrollBy({ left: -ref.scrollWidth! });
        ref?.scrollBy({ left: width!, behavior: "smooth" });
      }
    }
  }

  let animado = false;

  useEffect(() => {
    let frames: NodeJS.Timeout;
    const animate = async () => {
      frames = setTimeout(animate, time * 1000);
      moveLeft();
    };
    frames = setTimeout(animate, time * 1000);
    return () => clearTimeout(frames);
  });

  return (
    <div className="w-full h-[15rem] bg-green-200 rounded-3xl relative overflow-hidden">
      <button
        className="left-0 absolute h-full w-1/12  text-4xl cursor-pointer hover:text-5xl"
        onClick={moveLeft}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <div
        ref={scrollRef}
        className="flex  h-full overflow-hidden"
        onScrollEnd={() => {
          animado = false;
        }}
      >
        {items.map((e: { url: string }, key: number) => {
          // eslint-disable-next-line @next/next/no-img-element
          return <img className="min-w-full" key={key} src={e.url} alt="" />;
        })}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="min-w-full"
          key={totalItems}
          src={items[0]?.url}
          alt=""
        />
        ;
      </div>
      <button
        className="right-0 absolute h-full w-1/12 cursor-pointer top-0 text-4xl hover:text-5xl"
        onClick={moveRight}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
      <PointIndicator index={index} points={totalItems} />
    </div>
  );
};

export default CarrosselScroll;
