"use client";

import PaymentMethodModal from "@/components/paymentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useProfile } from "@/context/profile-context";
import type { PaymentMethod } from "@/types";
import { CreditCard, Edit, MoveLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentMethodsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const {
    paymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    refreshProfile,
  } = useProfile();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  const handleDelete = async (id: number) => {
    try {
      await deletePaymentMethod(id);
      refreshProfile();
    } catch (error) {
      console.error("Failed to delete payment method:", error);
    }
  };

  const handleSave = async (method: PaymentMethod) => {
    try {
      if (method.id) {
        await updatePaymentMethod(method.id, method);
      } else {
        await createPaymentMethod(method);
      }
      setIsModalOpen(false);
      setSelectedMethod(null);
      refreshProfile();
    } catch (error) {
      console.error("Failed to save payment method:", error);
    }
  };

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

  if (isLoading)
    return <div className="container py-8 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setSelectedMethod(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
            <Link href="/profile">
              <Button variant="outline">
                <MoveLeft className="mr-2 h-4 w-4" /> Back to Profile
              </Button>
            </Link>
          </div>
        </div>

        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                No payment methods found
              </p>
              <Button
                onClick={() => {
                  setSelectedMethod(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <CardTitle
                          className={`text-lg ${
                            method.cardName && getBrandColor(method.cardName)
                          }`}
                        >
                          {method.cardName}
                        </CardTitle>
                        <CardDescription>
                          •••• •••• •••• {method.numberLast4}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedMethod(method);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p>
                        Expires{" "}
                        {method.expiryMonth?.toString().padStart(2, "0")}/
                        {method.expiryYear}
                      </p>
                      <p>Card Holder: {method.holderName}</p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <PaymentMethodModal
        method={selectedMethod}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMethod(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
