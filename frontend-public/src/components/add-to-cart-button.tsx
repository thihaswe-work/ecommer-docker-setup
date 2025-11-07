"use client";

import { ShoppingCart } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  product: Product;
  quantity?: number;
  setQuantity?: (para?: any) => void;
}

export default function AddToCartButton({
  product,
  quantity,
  setQuantity,
  ...props
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity && setQuantity(1);
  };

  return (
    <Button onClick={handleAddToCart} className="flex-1" {...props}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
