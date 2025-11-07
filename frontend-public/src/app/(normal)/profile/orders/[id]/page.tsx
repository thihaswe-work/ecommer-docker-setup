"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import type { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Edit, MoveLeft } from "lucide-react";

export default function OrderDetailPage() {
  const { user, isLoading } = useAuth();
  const { orders } = useProfile();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    } else if (user && params?.id) {
      const found = orders.find((o) => o.id === params.id);
      setOrder(found || null);
      setLoading(false);
    }
  }, [user, isLoading, orders, params, router]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading || loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !order) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Order not found</p>
            <Link href="/profile/orders">
              <Button>Back to Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <Link href="/profile/orders">
            <Button variant="outline">
              <MoveLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Placed on {new Date(order.createdAt).toLocaleDateString()} •{" "}
              {formatCurrency(order.total)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge className={`${getStatusColor(order.status)} text-white`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="relative h-16 w-16 rounded overflow-hidden">
                  <Image
                    src={item.productImage || "/placeholder.svg"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} • {formatCurrency(item.price)}{" "}
                    each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping & Payment */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="text-sm space-y-1">
                  <p>{order.shippingAddress.addressName} </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No address found</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              {order.payment && order.paymentType === "card" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <div className="text-sm">
                      <p className={`font-medium text-gray-800`}>
                        {order.payment.cardName}
                      </p>
                      {order.payment.numberLast4 && (
                        <p className="text-muted-foreground">
                          •••• •••• •••• {order.payment.numberLast4}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Payment details unavailable
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
