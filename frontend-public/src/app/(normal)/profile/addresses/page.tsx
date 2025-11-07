"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, MoveLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import type { Address } from "@/types";
import AddressUpdateModal from "@/components/addressModal";
import { useProfile } from "@/context/profile-context";
import AddressModal from "@/components/addressModal";

export default function AddressesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const {
    addresses,
    createAddress,
    updateAddress,
    deleteAddress,
    refreshProfile,
  } = useProfile();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteAddress(addressId);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleSaveAddress = async (updated: Address) => {
    try {
      if (updated.id) {
        // Update existing
        await updateAddress(updated.id, updated);
      } else {
        // Create new
        await createAddress(updated);
      }
      setIsModalOpen(false);
      setSelectedAddress(null);
      refreshProfile(); // Optional: ensure latest data
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Addresses</h1>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setSelectedAddress(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>

            <Link href="/profile">
              <Button variant="outline">
                <MoveLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No addresses found</p>
              <Button
                onClick={() => {
                  setSelectedAddress(null); // <-- ensures new address
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {address.addressName} Address
                      </CardTitle>
                      {address.isDefault && (
                        <Badge variant="secondary" className="mt-1">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedAddress(address);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddressModal
        address={selectedAddress}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAddress(null);
        }}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
