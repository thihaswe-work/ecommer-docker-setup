import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmationDialog";
import type { User, PaymentMethod, Address, Role } from "@/types/type";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

export default function UserDetailPage() {
  const { id: userId } = useParams();
  const { data, removeItem, loading, updateItem } = useApi<User>({
    endpoint: `/users/${userId}`,
    transform: (res: any) => [res],
  });
  const user = data.find((u) => u.id === userId);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "user" | "address" | "payment" | null
  >(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [targetId, setTargetId] = useState<number | string | null>(null);
  const roles = ["admin", "user", "merchant"];
  if (!user)
    return <p className="text-gray-500 dark:text-gray-400">Loading user...</p>;

  const openDialog = (
    id: number | string,
    type: "user" | "address" | "payment"
  ) => {
    setTargetId(id);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (targetId == null || !dialogType) return;

    if (dialogType === "user") await removeItem(user.id, "/users");
    if (dialogType === "address") await removeItem(targetId, "/addresses");
    if (dialogType === "payment")
      await removeItem(targetId, "/payment-methods");

    setDialogOpen(false);
    setTargetId(null);
    setDialogType(null);
    if (dialogType === "user") navigate("/users");
  };
  const handleRoleChange = async (value: string) => {
    if (!user) return;
    const newRole = value as Role;
    try {
      setUpdatingRole(true);
      await updateItem(user.id, { role: newRole });
      toast(`User role updated to ${newRole}`);
    } catch (err) {
      toast("Failed to update role");
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <div className="p-6 rounded shadow-md space-y-6 text-gray-900 dark:text-gray-100">
      {/* User Info */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h2>
        <p>Email: {user.email}</p>

        {/* Role Dropdown */}
        <div className="flex items-center gap-2">
          <p>Role:</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={updatingRole}
                className="flex items-center gap-1"
              >
                {user.role.charAt(0).toUpperCase() +
                  user.role.slice(1).toLowerCase()}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className="cursor-pointer"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {updatingRole && (
            <span className="text-sm text-gray-500">Updating...</span>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.address?.length ? (
            user.address.map((addr: Address) => (
              <div
                key={addr.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded shadow-sm flex flex-col justify-between bg-white dark:bg-gray-800"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{addr.addressName}</p>
                  <p>
                    <strong>Address:</strong> {addr.address}
                  </p>
                  <p>
                    <strong>City:</strong> {addr.city}
                  </p>
                  <p>
                    <strong>State:</strong> {addr.state}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {addr.postalCode}
                  </p>
                  <p>
                    <strong>Country:</strong> {addr.country}
                  </p>
                  <p>
                    <strong>Default:</strong> {addr.isDefault ? "Yes" : "No"}
                  </p>
                </div>
                <Button
                  color="destructive"
                  size="sm"
                  onClick={() => openDialog(addr.id, "address")}
                  className="mt-4"
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No addresses found.
            </p>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.paymentMethod?.filter((pm) => pm.type === "card").length ? (
            user.paymentMethod
              .filter((pm: PaymentMethod) => pm.type === "card")
              .map((pm: PaymentMethod) => (
                <div
                  key={pm.id}
                  className="relative p-4 rounded-lg shadow-md bg-gradient-to-r from-indigo-600 to-blue-500 text-white flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{pm.cardName}</p>
                    <p>Number: **** **** **** {pm.number.slice(-4)}</p>
                    <p>Holder: {pm.holderName || "-"}</p>
                    <p>
                      Expiry: {pm.expiryMonth}/{pm.expiryYear}
                    </p>
                    <p>Default: {pm.isDefault ? "Yes" : "No"}</p>
                  </div>
                  <Button
                    color="destructive"
                    size="sm"
                    onClick={() => openDialog(pm.id, "payment")}
                    className="mt-4"
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No card payment methods found.
            </p>
          )}
        </div>
      </div>

      {/* Delete User */}
      <Button
        color="destructive"
        onClick={() => openDialog(user.id, "user")}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete User"}
      </Button>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        title="Confirm Delete"
        description={`Are you sure you want to delete this ${dialogType}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
