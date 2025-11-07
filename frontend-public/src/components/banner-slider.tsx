"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const banners = [
  {
    title: "Shop the Latest Products",
    description:
      "Discover our curated collection of high-quality products at competitive prices.",
    link: "/products",
    bgGradient: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
  {
    title: "Exclusive Deals Every Week",
    description:
      "Grab the best discounts on top products, only for our customers.",
    link: "/products",
    bgGradient: "bg-gradient-to-r from-green-500 to-teal-600",
  },
  {
    title: "New Arrivals Just Landed",
    description:
      "Check out the newest products in our store and stay ahead of trends.",
    link: "/products",
    bgGradient: "bg-gradient-to-r from-pink-500 to-red-500",
  },
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % banners.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full relative overflow-hidden min-h-[300px] h-[500px]">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`w-full py-12 md:py-24 lg:py-32 flex items-center justify-center text-white transition-opacity duration-1000 ease-in-out absolute top-0 left-0 h-full ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          } ${banner.bgGradient}`}
        >
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {banner.title}
            </h2>
            <p className="max-w-lg mx-auto text-sm md:text-base lg:text-lg">
              {banner.description}
            </p>
            <Link href={banner.link}>
              <Button
                size="lg"
                className="mt-4 bg-white text-black hover:bg-gray-100"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
