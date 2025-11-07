import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/products";
import BannerSlider from "@/components/banner-slider";
import { getAllCateogires } from "@/lib/categories";
import { Category } from "@/types";
import CategoryScroller from "@/components/categories-scroll";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories: Category[] = await getAllCateogires();
  console.log("fetauredProducts", featuredProducts);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <BannerSlider />

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 lg:pb-10">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Shop by Category
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Browse our wide range of categories to find what you love.
            </p>
          </div>

          {/* Swipeable Categories */}
          <CategoryScroller categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Featured Products
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Check out our most popular items this season.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-6 mt-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Free Shipping</h3>
              <p className="text-muted-foreground">On all orders over $100</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Easy Returns</h3>
              <p className="text-muted-foreground">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Checkout</h3>
              <p className="text-muted-foreground">Safe & protected payment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
