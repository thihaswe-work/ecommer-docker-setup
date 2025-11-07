"use client";

import type React from "react";
import { useState } from "react";
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
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading, updateUser, updatePassword } = useAuth();
  const router = useRouter();

  // Email section
  const [email, setEmail] = useState(user?.email || "");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  // Password section
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Handle email update
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSubmitting(true);

    try {
      await updateUser({ email });
      setEmailSuccess("email changed successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setIsEmailSubmitting(false);
      setTimeout(() => {
        setEmailSuccess("");
      }, 5000);
    }
  };

  // Handle password update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword === currentPassword) {
      setPasswordError("can't change to old password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsPasswordSubmitting(true);

    const success = await updatePassword({ currentPassword, newPassword });
    if (!success) {
      setPasswordError("Current password is incorrect");
    }

    setIsPasswordSubmitting(false);
    setPasswordSuccess("Password Changed Successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setPasswordSuccess("");
    }, 5000);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="space-x-2">
            <Link href="/profile">
              <Button variant="outline">
                <MoveLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>
        {/* Email Update */}
        <Card>
          <CardHeader>
            <CardTitle>Update Email</CardTitle>
            <CardDescription>
              Change the email associated with your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleEmailSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>{" "}
              {emailSuccess && (
                <div className="text-green-500 text-sm">{emailSuccess}</div>
              )}
              <Button type="submit" disabled={isEmailSubmitting}>
                {isEmailSubmitting ? "Saving..." : "Save Email"}
              </Button>
            </CardContent>
          </form>
        </Card>
        {/* Password Update */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="text-green-500 text-sm">{passwordSuccess}</div>
              )}
              <Button type="submit" disabled={isPasswordSubmitting}>
                {isPasswordSubmitting ? "Saving..." : "Change Password"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
