import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Product } from "@/types";
import AddToCardItems from "@/components/add-to-cart-items";
import { ProductDetailSkeleton } from "@/components/product-detail-skeleton";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail id={params.id} />
      </Suspense>
    </div>
  );
}
const ProductDetail = async ({ id }: { id: string }) => {
  const product = await getProductById(Number(id));
  if (!product) {
    notFound();
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">
          ${product.inventory.price.toFixed(2)}
        </p>
        <div className="prose max-w-none">
          <p>{product.desc}</p>
        </div>
        <div className="flex flex-col space-y-2 mt-6">
          {/* <AddToCartButton product={product} /> */}
          <AddToCardItems product={product} />
          {/* <Button variant="outline">Add to Wishlist</Button> */}
        </div>
      </div>
    </div>
  );
};
