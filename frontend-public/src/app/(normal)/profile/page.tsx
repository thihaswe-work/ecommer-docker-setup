"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Edit,
  Package,
  CreditCard,
  MapPin,
  User,
} from "lucide-react";
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

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative h-20 w-20 rounded-full overflow-hidden">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={"userImage"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {user.firstName + user.lastName}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            {/* {user.phone && (
              <p className="text-muted-foreground">{user.phone}</p>
            )} */}
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Calendar className="mr-1 h-4 w-4" />
              Member since {new Date(user.createdAt).getFullYear()}
            </p>
          </div>
          <Link href="/profile/edit">
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/profile/orders">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle className="ml-2 text-lg">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View your order history and track current orders
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile/addresses">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="ml-2 text-lg">Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage your shipping and billing addresses
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile/payment-methods">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle className="ml-2 text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage your saved payment methods
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile/settings">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="ml-2 text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
