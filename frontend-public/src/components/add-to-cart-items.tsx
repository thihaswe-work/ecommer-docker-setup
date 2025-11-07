"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";
import { Product } from "@/types";
import { useState } from "react";

interface AddToCartItemsProps {
  product: Product;
}
export default function AddToCardItems({ product }: AddToCartItemsProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={quantity === 1}
          className="h-8 w-8"
          onClick={() => setQuantity((prev) => prev - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <AddToCartButton
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </>
  );
}
