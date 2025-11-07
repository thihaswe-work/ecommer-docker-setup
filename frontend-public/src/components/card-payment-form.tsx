"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from "@/types";
import { useState } from "react";

interface Props {
  user: any;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (val: string) => void;
}

export default function CardPaymentForm({
  user,
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: Props) {
  const [cardName, setCardName] = useState("Visa"); // default selection
  const getBrandColor = (cardName: string) => {
    switch (cardName?.toLowerCase()) {
      case "visa":
        return "text-blue-600";
      case "mastercard":
        return "text-red-600";
      case "amex":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {user && paymentMethods.length > 0 && selectedPaymentMethod && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Choose from saved payment methods</Label>
            <Select
              value={selectedPaymentMethod}
              onValueChange={(val) => setSelectedPaymentMethod(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a saved payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={String(method.id)}>
                    {method.cardName} ****{method.numberLast4} (exp
                    {method.expiryMonth}/{method.expiryYear})
                    {method.isDefault && " (Default)"}
                  </SelectItem>
                ))}
                <SelectItem value="new">Use a new payment method</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {(!user || selectedPaymentMethod === "new") && (
        <div className="space-y-4 mt-4 relative" id="card-form">
          {/* Card Type Selector at top-right */}
          <div className="absolute top-0 right-0 flex  space-x-5">
            {["Visa", "Mastercard", "Amex"].map((type) => (
              <img
                key={type}
                src={`/cards/${type}.png`}
                alt={type}
                className={`w-12 h-10  object-contain cursor-pointer border rounded-md  transition-all ${
                  cardName === type
                    ? "border-blue-500 shadow-md border-2 "
                    : "border-gray-300 hover:border-gray-400 opacity-45"
                }`}
                onClick={() => setCardName(type)}
              />
            ))}
          </div>
          <input
            className={`bg-transparent shadow-none text-2xl font-bold cursor-default text-blue-600 flex items-center
    border-none focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-0 ${getBrandColor(
      cardName
    )}`}
            value={cardName}
            id="cardName"
            name="cardName"
            readOnly
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holderName">Name on Card</Label>
              <Input id="holderName" name="holderName" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input type="number" id="expiryMonth" required min={1} max={12} />
            </div>
            <div>
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                type="number"
                id="expiryYear"
                required
                min={2000}
                max={9999}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" name="cvc" placeholder="123" required />
            </div>
          </div>
        </div>
      )}

      {selectedPaymentMethod === "paypal" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You will be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      )}
    </div>
  );
}
