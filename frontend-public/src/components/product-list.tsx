import { Product } from "@/types";
import ProductCard from "./product-card";
import { getAllProducts } from "@/lib/products";
import Link from "next/link";

interface ProductListProps {
  query?: string;
  min?: string;
  max?: string;
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  category: string[];
}

export default async function ProductList({
  query = "",
  min = "",
  max = "",
  order = "ASC",
  page = 1,
  limit = 12,
  category = [],
}: ProductListProps) {
  const response = await getAllProducts({
    query,
    min,
    max,
    order,
    page,
    limit,
    category,
  });
  const { data: products, meta } = response;
  const searchparams = new URLSearchParams({
    query,
    min,
    max,
    order,
  });

  if (!products || products.length === 0) {
    return <div className="text-center py-12">No products found</div>;
  }

  return (
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        {/* Previous Button */}
        <Link
          href={`?${searchparams}&page=${Math.max(meta.currentPage - 1, 1)}`}
          className={`px-4 py-2 rounded bg-muted hover:bg-muted/70 ${
            meta.currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Prev
        </Link>

        {/* Page Numbers */}
        {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (meta.totalPages <= 3) return true;
            if (meta.currentPage <= 2) return page <= 3;
            if (meta.currentPage >= meta.totalPages - 1)
              return page >= meta.totalPages - 2;
            return page >= meta.currentPage - 1 && page <= meta.currentPage + 1;
          })
          .map((page) => (
            <Link
              key={page}
              href={`?${searchparams}&page=${page}`}
              className={`px-4 py-2 rounded ${
                page === meta.currentPage
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/70"
              }`}
            >
              {page}
            </Link>
          ))}

        {/* Next Button */}
        <Link
          href={`?${searchparams}&page=${Math.min(
            meta.currentPage + 1,
            meta.totalPages
          )}`}
          className={`px-4 py-2 rounded bg-muted hover:bg-muted/70 ${
            meta.currentPage === meta.totalPages
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          Next
        </Link>
      </div>
    </>
  );
}
