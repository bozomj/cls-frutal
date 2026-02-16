import { useEffect, useLayoutEffect, useRef, useState } from "react";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
};

export function HorizontalScroll({
  children,
  className,
}: HorizontalScrollProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(0);
  const [sizes, setSizes] = useState({
    viewport: 0,
    content: 0,
  });

  const drag = useRef({
    active: false,
    startX: 0,
    startOffset: 0,
    source: "none" as "thumb" | "container" | "none",
  });

  // Medir dimensões
  useLayoutEffect(() => {
    if (!viewportRef.current || !contentRef.current) return;

    setSizes({
      viewport: viewportRef.current.offsetWidth,
      content: contentRef.current.scrollWidth,
    });
  }, [children]);

  // Wheel (passive false)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();

      const maxScroll = sizes.content - sizes.viewport;

      setOffset((prev) => {
        const next = prev + e.deltaY;
        return Math.min(Math.max(next, 0), maxScroll);
      });
    }

    viewport.addEventListener("wheel", onWheel, {
      passive: false,
    });

    return () => viewport.removeEventListener("wheel", onWheel);
  }, [sizes]);

  // Drag global
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!drag.current.active) return;

      const delta = e.clientX - drag.current.startX;

      const maxScroll = sizes.content - sizes.viewport;

      let next = drag.current.startOffset;

      if (drag.current.source === "thumb") {
        const maxThumbX = sizes.viewport - thumbWidth;

        const scrollDelta = (delta / maxThumbX) * maxScroll;

        next += scrollDelta;
      }

      if (drag.current.source === "container") {
        // arrastar conteúdo (inverte direção)
        next -= delta;
      }

      setOffset(Math.min(Math.max(next, 0), maxScroll));
    }

    function onMouseUp() {
      drag.current.active = false;
      drag.current.source = "none";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [sizes, offset]);

  // Cálculos da barra
  const maxScroll = sizes.content - sizes.viewport;

  const thumbWidth =
    sizes.content > 0 ? (sizes.viewport / sizes.content) * sizes.viewport : 0;

  const thumbX =
    maxScroll > 0 ? (offset / maxScroll) * (sizes.viewport - thumbWidth) : 0;

  return (
    <div className={`flex flex-col gap-2`}>
      {/* VIEWPORT */}
      <div
        ref={viewportRef}
        className={`overflow-hidden cursor-grab active:cursor-grabbing  ${className}`}
        onMouseDown={(e) => {
          drag.current.active = true;
          drag.current.startX = e.clientX;
          drag.current.startOffset = offset;
          drag.current.source = "container";
        }}
      >
        <div
          ref={contentRef}
          className="flex gap-2 select-none p-2"
          style={{
            transform: `translateX(${-offset}px)`,
          }}
        >
          {children}
        </div>
      </div>

      {/* SCROLLBAR */}
      <div className="bg-gray-500 w-full h-1 relative">
        <span
          className="h-1 bg-accent absolute cursor-pointer"
          style={{
            width: `${thumbWidth}px`,
            transform: `translateX(${thumbX}px)`,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            drag.current.active = true;
            drag.current.startX = e.clientX;
            drag.current.startOffset = offset;
            drag.current.source = "thumb";
          }}
        />
      </div>
    </div>
  );
}
