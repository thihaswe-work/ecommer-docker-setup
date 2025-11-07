"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { MoveLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const { user, updateUser, isLoading } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(""); // new state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setAvatar(user.avatar || ""); // initialize with existing URL if any
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call

    updateUser({ firstName, lastName, avatar, phone }); // include profileImage
    setIsSubmitting(false);
    router.push("/profile");
  };

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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-end mb-6">
          <div className="space-x-2">
            <Link href="/profile">
              <Button variant="outline">
                <MoveLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Profile Image URL */}
              <div className="space-y-2">
                <div className="py-10">
                  <Image
                    src={user.avatar || "/placeholder-user.jpg"}
                    width={150}
                    height={150}
                    alt="avatar"
                    className="rounded-full overflow-hidden mx-auto "
                  />
                </div>
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input
                  id="profileImage"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {/* Name */}
              <div className="flex gap-2">
                <div className="space-y-2 w-1/2">
                  <Label htmlFor="name">FirstName</Label>
                  <Input
                    id="name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 w-1/2">
                  <Label htmlFor="name">LastName</Label>
                  <Input
                    id="name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
