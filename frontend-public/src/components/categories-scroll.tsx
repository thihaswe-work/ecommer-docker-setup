"use client";

import { Category } from "@/types";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// Card.tsx
const Card = ({
  category,
  dragDistance,
}: {
  category: Category;
  dragDistance: number;
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // If the user dragged more than 5px, prevent navigation
    if (dragDistance > 5) {
      e.preventDefault();
      return;
    }
    router.push(`/products?category=${encodeURIComponent(category.id)}`);
  };

  return (
    <div className="inline-flex justify-center w-48 h-36 mr-4 text-white text-xl rounded-lg shadow-md">
      <div
        onClick={handleClick}
        className="group relative flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-background shadow-sm hover:shadow-md cursor-pointer select-none"
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-md">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

// HorizontalScroll.tsx
const CategoryScroller = ({ categories }: { categories: Category[] }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setDragDistance(0);
  }, []);

  const handleStopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault();

      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1;
      scrollRef.current.scrollLeft = scrollLeft - walk;

      setDragDistance(Math.abs(x - startX)); // track distance dragged
    },
    [isDragging, startX, scrollLeft]
  );

  // handle wheel same as before
  const handleWheel = useCallback((e: WheelEvent) => {
    if (scrollRef.current) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    }
  }, []);
  // Inside CategoryScroller component
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Check overflow whenever categories or container width changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories]);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    // slider.addEventListener("mousedown", handleMouseDown);
    // slider.addEventListener("mouseleave", handleStopDragging);
    // slider.addEventListener("mouseup", handleStopDragging);
    // slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      // slider.removeEventListener("mousedown", handleMouseDown);
      // slider.removeEventListener("mouseleave", handleStopDragging);
      // slider.removeEventListener("mouseup", handleStopDragging);
      // slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("wheel", handleWheel);
    };
  }, [handleMouseDown, handleStopDragging, handleMouseMove, handleWheel]);

  const items = [
    ...categories,
    // ...categories,
    // ...categories,
    // ...categories,
    // ...categories,
  ].map((cat, i) => (
    <Card key={i} category={cat} dragDistance={dragDistance} />
  ));

  return (
    <div className="app-container">
      <div
        onMouseDown={handleMouseDown}
        onMouseLeave={handleStopDragging}
        onMouseUp={handleStopDragging}
        onMouseMove={handleMouseMove}
        onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
          e.preventDefault();
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
          }
        }}
        ref={scrollRef}
        className={`horizontal-scroll-container flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory ${
          isDragging ? "dragging cursor-grabbing select-none" : "cursor-grab"
        } ${!isOverflowing ? "justify-center" : ""}`}
      >
        {items}
      </div>
    </div>
  );
};

export default CategoryScroller;
