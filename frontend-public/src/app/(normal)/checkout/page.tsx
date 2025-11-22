// chatgpt
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTruck } from "react-icons/fa";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useProfile } from "@/context/profile-context";
import { formatCurrency } from "@/lib/utils";

import { Address, PaymentMethod } from "@/types";
import AddressForm from "../../../components/address-form";
import CardPaymentForm from "../../../components/card-payment-form";
import ContactForm from "../../../components/contact-form";
import OrderSummary from "../../../components/order-summary";

const defaultOptions = [
  { id: "card", label: "Card" },
  { id: "paypal", label: "PayPal" },
  { id: "onDelivery", label: "On Delivery" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, handleOrder } = useCart();
  const {
    paymentMethods,
    addresses,
    refreshProfile,
    defaultAddress,
    defaultPaymentMethod,
  } = useProfile();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkoutType, setCheckoutType] = useState<"guest" | "signin" | null>(
    null
  );

  // address
  const [selectedAddress, setSelectedAddress] = useState<string>(
    String(defaultAddress?.id ?? "")
  );
  const [useNewAddress, setUseNewAddress] = useState(
    addresses.length > 0 ? false : true
  );

  // payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    String(defaultPaymentMethod?.id || "new")
  );
  const [selectedType, setSelectedType] = useState<string>("card");

  const [wantOrderTracking, setWantOrderTracking] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Totals
  const subtotal = cart.reduce(
    (total, item) => total + item.inventory.price * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  useEffect(() => {
    setSelectedAddress(String(defaultAddress?.id ?? ""));
    setSelectedPaymentMethod(String(defaultPaymentMethod?.id ?? "new"));
  }, [defaultAddress, defaultPaymentMethod]);

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Guest or Sign-in choice
  if (!user && checkoutType === null) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How would you like to checkout?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={() => setCheckoutType("guest")}
              >
                Continue as Guest
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() =>
                  router.push(
                    "/auth/login?redirect=" +
                      encodeURIComponent(window.location.pathname)
                  )
                }
              >
                Sign In to Your Account
              </Button>
            </CardContent>
          </Card>

          {checkoutType === "guest" && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tracking"
                    checked={wantOrderTracking}
                    onCheckedChange={(checked) =>
                      setWantOrderTracking(checked as boolean)
                    }
                  />
                  <Label htmlFor="tracking" className="text-sm">
                    I want to track my order (requires creating an account)
                  </Label>
                </div>
                {wantOrderTracking && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll be able to create an account after placing your
                    order.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // 1. Contact Info
    const contactForm = e.currentTarget.querySelector(
      "#contact-form"
    ) as HTMLElement;

    const firstNameInput = contactForm.querySelector(
      '[name="firstName"]'
    ) as HTMLInputElement;
    const lastNameInput = contactForm.querySelector(
      '[name="lastName"]'
    ) as HTMLInputElement;
    const emailInput = contactForm.querySelector(
      '[name="email"]'
    ) as HTMLInputElement;
    const phoneInput = contactForm.querySelector(
      '[name="phone"]'
    ) as HTMLInputElement;

    const contactData = {
      firstName: firstNameInput?.value.trim(),
      lastName: lastNameInput?.value.trim(),
      email: emailInput?.value.trim(),
      phone: phoneInput?.value.trim(),
    };

    // 2. Address (if using new address or existing)
    let addressData = null;

    if (selectedType !== "onDelivery") {
      if (useNewAddress) {
        const addressSection = e.currentTarget.querySelector(
          "#address-form"
        ) as HTMLElement;

        addressData = {
          address: (
            addressSection.querySelector('[name="address"]') as HTMLInputElement
          )?.value.trim(),
          city: (
            addressSection.querySelector('[name="city"]') as HTMLInputElement
          )?.value.trim(),
          state: (
            addressSection.querySelector('[name="state"]') as HTMLInputElement
          )?.value.trim(),
          postalCode: (
            addressSection.querySelector(
              '[name="postalCode"]'
            ) as HTMLInputElement
          )?.value.trim(),
          country: (
            addressSection.querySelector('[name="country"]') as HTMLInputElement
          )?.value.trim(),
        };
      } else {
        addressData = addresses.find(
          (addr) => String(addr.id) === selectedAddress
        );
      }
    }

    // 3. Payment Method
    let paymentData = null;

    if (selectedType === "card") {
      if (selectedPaymentMethod === "new") {
        const cardSection = e.currentTarget.querySelector(
          "#card-form"
        ) as HTMLElement;

        paymentData = {
          amount: total,
          paymentType: "card",
          number: (
            cardSection.querySelector('[name="cardNumber"]') as HTMLInputElement
          )?.value.trim(),
          holderName: (
            cardSection.querySelector('[name="holderName"]') as HTMLInputElement
          )?.value.trim(),
          cardName: (
            cardSection.querySelector('[name="cardName"]') as HTMLInputElement
          )?.value.trim(),
          // cvc: (cardSection.querySelector('[name="cvc"]') as HTMLInputElement)?.value.trim(),
        };
      } else {
        const selectedCard = paymentMethods.find(
          (p) => String(p.id) === selectedPaymentMethod
        ) as PaymentMethod;

        paymentData = {
          amount: total,
          paymentType: "card",
          number: selectedCard.number,
          holderName: selectedCard.holderName,
          cardName: selectedCard.cardName,
        };
      }
    } else if (selectedType === "paypal") {
      paymentData = { paymentType: "paypal", amount: total };
    } else if (selectedType === "onDelivery") {
      paymentData = { paymentType: "onDelivery", amount: total };
    }

    // 4. Cart Items
    const cartItems = cart.map((item) => ({
      productId: item.inventory.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.inventory.price,
      productImage: item.image,
    }));

    if (
      !contactData?.firstName ||
      !contactData?.email ||
      !paymentData ||
      (selectedType !== "onDelivery" && !addressData)
    ) {
      setFormError(
        "Please fill all required fields before submitting the order."
      );
      setIsSubmitting(false);
      return;
    }
    // 5. Construct order payload
    const orderPayload = {
      customerId: user && user.id,
      orderItems: cartItems,
      contact: contactData,
      shippingAddress: addressData,
      payment: paymentData,
      subtotal,
      shipping,
      total,
    };

    try {
      const isOk = await handleOrder(orderPayload);

      if (isOk) {
        refreshProfile();
        router.push("/checkout/success");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
      clearCart();
    }
  };
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <ContactForm user={user} />
            <AddressForm
              defaultAddress={defaultAddress}
              user={user}
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              useNewAddress={useNewAddress}
              setUseNewAddress={setUseNewAddress}
            />
            {/* Payment */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>

              {/* Tabs */}
              <div className="flex space-x-2 border-b border-gray-200">
                {defaultOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`px-4 py-2 font-medium ${
                      selectedType === option.id
                        ? "border-b-2 border-gray-500 text-gray-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setSelectedType(option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="mt-4">
                {selectedType === "card" && (
                  <CardPaymentForm
                    user={user}
                    paymentMethods={paymentMethods}
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                )}

                {selectedType === "paypal" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                      You will be redirected to PayPal to complete your payment
                      securely.
                    </p>
                  </div>
                )}

                {selectedType === "onDelivery" && (
                  <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <FaTruck className="text-green-600 w-6 h-6" />
                    <p className="text-green-800 font-medium">
                      Pay on Delivery
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!user && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> To track your order, you'll need to
                    create an account.
                  </p>
                </CardContent>
              </Card>
            )}
            {formError && <p className="text-red-500 mb-2">{formError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Pay ${formatCurrency(total)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
