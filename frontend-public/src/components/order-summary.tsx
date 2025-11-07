import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

interface CartItem extends Product {
  quantity: number;
}
export default function OrderSummary({
  cart,
  subtotal,
  shipping,
  total,
}: {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <p className="font-medium">
                {item.name} × {item.quantity}
              </p>
            </div>
            <p>{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
