import CategorySelect from "@/components/category-select";
import ProductList from "@/components/product-list";
import ProductSearch from "@/components/product-search";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { getAllCateogires } from "@/lib/categories";
import { Category } from "@/types";
import { lazy, Suspense } from "react";

// ### Testing the lazy
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// Wrap the import with a delay
// const ProductList = lazy(
//   () => delay(8000).then(() => import("@/components/product-list")) // 3 seconds delay
// );
// const ProductList = lazy(() => import("@/components/product-list"));
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    min: string;
    limit: string;
    max: string;
    order: "ASC" | "DESC";
    page: string;
    category: string[];
  };
}) {
  const categories: Category[] = await getAllCateogires();

  const query = searchParams.query || "";
  const min = searchParams.min || "";
  const max = searchParams.max || "";
  const order = searchParams.order || "ASC";
  const limit = searchParams.limit || "12";
  const categoryParam = searchParams.category ?? [];
  const categoriesArray = Array.isArray(categoryParam)
    ? categoryParam
    : [categoryParam];

  // const params = new URLSearchParams({
  //   query,
  //   min,
  //   max,
  //   order,
  //   limit,
  // });
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
      <div className="flex flex-col mb-4 gap-2">
        <h1 className="text-3xl font-bold ">All Products</h1>
        <CategorySelect categories={categories} />
      </div>

      <ProductSearch />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 19 }).map((_, index) => {
              return <ProductCardSkeleton key={index} />;
            })}
          </div>
        }
      >
        <ProductList
          query={searchParams.query}
          min={searchParams.min}
          max={searchParams.max}
          order={searchParams.order}
          page={Number(searchParams?.page || 1)}
          category={categoriesArray}
        />
      </Suspense>
    </div>
  );
}
