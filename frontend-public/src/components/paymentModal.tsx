"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import type { PaymentMethod } from "@/types";
import { Checkbox } from "./ui/checkbox";

interface PaymentMethodModalProps {
  method: PaymentMethod | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: PaymentMethod) => void;
}

const getBrandColor = (cardName: string) => {
  switch (cardName?.toLowerCase()) {
    case "visa":
      return "text-blue-600";
    case "master":
    case "mastercard":
      return "text-red-600";
    case "amex":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export default function PaymentMethodModal({
  method,
  isOpen,
  onClose,
  onSave,
}: PaymentMethodModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PaymentMethod>({
    defaultValues: method || {},
    shouldUnregister: true,
  });

  const cardName = watch("cardName"); // 👀 watch selected brand

  useEffect(() => {
    reset(method || {});
  }, [method, reset]);

  const onSubmit = (data: PaymentMethod) => {
    if (method && method.id) {
      onSave({ ...method, ...data });
    } else {
      onSave({ ...data });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-40 animate-fadeIn" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 sm:max-w-lg w-full p-6 bg-white rounded-lg shadow-lg animate-slideIn">
        <DialogTitle>
          <h2 className="text-lg font-bold mb-4">
            {method ? "Edit Payment Method" : "Add Payment Method"}
          </h2>
        </DialogTitle>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Card Name Selection */}
          <div className="relative space-y-2 ">
            <Label htmlFor="cardName">Card Brand</Label>
            <div className="flex items-center">
              <input
                id="cardName"
                {...register("cardName", {
                  required: "Card brand is required",
                })}
                value={cardName || ""}
                readOnly
                className={`bg-transparent shadow-none text-xl font-bold cursor-default
                border-none focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-0
                ${getBrandColor(cardName)}
              `}
              />
              {/* Image selector */}
              <div className="flex space-x-3 mb-2 justify-end ">
                {["Visa", "Mastercard", "Amex"].map((type) => (
                  <img
                    key={type}
                    src={`/cards/${type}.png`}
                    alt={type}
                    className={`w-14 h-10 object-contain cursor-pointer border rounded-md transition-all
                    ${
                      cardName?.toLowerCase() === type
                        ? "border-blue-500 shadow-md"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      setValue("cardName", type, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Readonly input to hold form value */}

            {errors.cardName && (
              <p className="text-red-500 text-sm">{errors.cardName.message}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <Label htmlFor="number">Card Number</Label>
            <Input
              id="number"
              {...register("number", { required: "Required" })}
            />
            {errors.number && (
              <p className="text-red-500 text-sm">{errors.number.message}</p>
            )}
          </div>

          {/* Card Holder */}
          <div>
            <Label htmlFor="holderName">Card Holder</Label>
            <Input
              id="holderName"
              {...register("holderName", { required: "Required" })}
            />
            {errors.holderName && (
              <p className="text-red-500 text-sm">
                {errors.holderName.message}
              </p>
            )}
          </div>

          {/* Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input
                type="number"
                id="expiryMonth"
                {...register("expiryMonth", { required: "Required" })}
              />
            </div>
            <div>
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                type="number"
                id="expiryYear"
                {...register("expiryYear", { required: "Required" })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isDefault"
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isDefault">Set as Default</Label>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>

        <DialogClose className="absolute top-3 right-3">✕</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
