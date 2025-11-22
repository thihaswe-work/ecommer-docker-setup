"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Address } from "@/types";

interface AddressModalProps {
  address: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Address) => void;
}

export default function AddressModal({
  address,
  isOpen,
  onClose,
  onSave,
}: AddressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: address || {},
    shouldUnregister: true,
  });

  useEffect(() => {
    reset(address || {});
  }, [address, reset]);

  const onSubmit = (data: Address) => {
    if (address && address.id) {
      // Updating existing
      onSave({ ...address, ...data });
    } else {
      // Creating new
      onSave({ ...data });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-40 animate-fadeIn" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 sm:max-w-lg w-full p-6 bg-white rounded-lg shadow-lg animate-slideIn">
        <DialogClose className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer">
          ✕
        </DialogClose>

        <DialogTitle>
          <h2 className="text-lg font-bold mb-4">
            {address && address.id ? "Edit Address" : "Add Address"}
          </h2>
        </DialogTitle>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="addressName">Address Name</Label>
            <Input
              id="addressName"
              {...register("addressName", { required: true })}
            />
            {errors.addressName && (
              <p className="text-red-500 text-sm">
                {errors.addressName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address", { required: true })} />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city", { required: true })} />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state", { required: true })} />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                {...register("postalCode", { required: true })}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country", { required: true })} />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
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

          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
