"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Address } from "@/types";

interface Props {
  user: any;
  defaultAddress: Address | undefined;
  addresses: Address[];
  selectedAddress: string;
  setSelectedAddress: (val: string) => void;
  useNewAddress: boolean;
  setUseNewAddress: (val: boolean) => void;
}

export default function AddressForm({
  user,
  addresses,
  selectedAddress,
  setSelectedAddress,
  useNewAddress,
  setUseNewAddress,
  defaultAddress,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>

      {user && addresses.length > 0 && selectedAddress !== null && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Choose from saved addresses</Label>
            <Select
              value={selectedAddress}
              onValueChange={(val) => {
                setSelectedAddress(val);
                setUseNewAddress(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a saved address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={String(address.id)}>
                    {address.addressName} – {address.address}, {address.city},{" "}
                    {address.state}
                    {address.isDefault && " (Default)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newAddress"
              checked={useNewAddress}
              onCheckedChange={(checked) => {
                setUseNewAddress(!!checked);

                if (!checked && defaultAddress)
                  setSelectedAddress(String(defaultAddress.id));
                if (checked) setSelectedAddress("");
              }}
            />
            <Label htmlFor="newAddress">Use a different address</Label>
          </div>
        </div>
      )}

      {(!user || useNewAddress) && (
        <div id="address-form">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" name="postalCode" required />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
