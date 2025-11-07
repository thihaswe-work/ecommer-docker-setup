import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const { fetchData, updateProfile } = useApi<ProfileForm>({
    endpoint: "/me/adminProfile",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const { user: data } = useAuthStore();
  const profileForm = useForm<ProfileForm>({
    defaultValues: { firstName: "", lastName: "", email: "", avatar: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load profile data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!data) return;
    const { password, ...safeData } = Array.isArray(data) ? data[0] : data;
    profileForm.reset(safeData);
  }, [data, profileForm]);

  // Submit profile updates
  const onSubmitProfile = async (values: ProfileForm) => {
    try {
      setIsSavingProfile(true);
      await updateProfile(values, "/me");
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Submit password updates
  const onSubmitPassword = async (values: PasswordForm) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsSavingPassword(true);
      await updateProfile({ currentPassword, newPassword }, "/me/password");
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (err) {
      toast.error("Failed to update password. Check your current password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm space-y-10">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      {/* ---------------- PROFILE FORM ---------------- */}
      <form
        onSubmit={profileForm.handleSubmit(onSubmitProfile)}
        className="space-y-5"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={profileForm.watch("avatar") || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <Input placeholder="Avatar URL" {...profileForm.register("avatar")} />
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input {...profileForm.register("firstName", { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input {...profileForm.register("lastName", { required: true })} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            {...profileForm.register("email", { required: true })}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>

      {/* ---------------- PASSWORD FORM ---------------- */}
      <form
        onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
        className="space-y-5 border-t pt-6"
        autoComplete="off"
      >
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <Input
            type="password"
            autoComplete="current-password"
            {...passwordForm.register("currentPassword", { required: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <Input
            type="password"
            autoComplete="new-password"
            {...passwordForm.register("newPassword", { required: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <Input
            type="password"
            autoComplete="new-password"
            {...passwordForm.register("confirmPassword", { required: true })}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
