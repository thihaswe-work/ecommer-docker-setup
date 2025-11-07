import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types";
import AddToCartButton from "./add-to-cart-button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col justify-between">
      <div className="relative aspect-square">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          priority
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.desc}
        </p>
        {/* <p className="font-medium mt-2">${product.price.toFixed(2)}</p> */}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <AddToCartButton product={product} variant="secondary" />
        <Link href={`/products/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
