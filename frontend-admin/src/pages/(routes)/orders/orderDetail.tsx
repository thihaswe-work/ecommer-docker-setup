"use client";

import { useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import type { Order, OrderItem, User } from "@/types/type";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch order
  const { data: orders, loading: loadingOrder } = useApi<Order>({
    endpoint: `/orders/${id}`,
    transform: (res) => (res ? [res] : []),
  });
  const order = orders[0];

  // Conditionally fetch user only if customerId does not start with "guest"
  const { data: users, loading: loadingUser } = useApi<User>({
    endpoint:
      order && !order.customerId.startsWith("guest")
        ? `/users/${order.customerId}`
        : "",
    transform: (res) => (res ? [res] : []),
  });
  const user = users?.[0];

  if (loadingOrder) return <div>Loading order...</div>;
  if (!order) return <div>Order not found</div>;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>

      {user ? (
        <p>
          <strong>User:</strong> {user.firstName + user.lastName} ({user.email})
        </p>
      ) : (
        <p>
          <strong>User ID:</strong> {order.customerId} (Guest)
        </p>
      )}

      <p
        className={`${
          statusColors[order.status]
        } max-w-40 rounded-sm py-2 px-5`}
      >
        <strong>Status:</strong> {order.status}
      </p>

      <p>
        <strong>Total:</strong> ${order.total.toFixed(2)}
      </p>

      <h2 className="text-xl font-semibold mt-4">Items</h2>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 dark:bg-muted">
            <th className="px-2 py-1 border">Product</th>
            <th className="px-2 py-1 border">Price</th>
            <th className="px-2 py-1 border">Quantity</th>
            <th className="px-2 py-1 border">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems?.map((item: OrderItem) => (
            <tr key={item.id}>
              <td className="px-2 py-1 border">{item.productName}</td>
              <td className="px-2 py-1 border">${item.price.toFixed(2)}</td>
              <td className="px-2 py-1 border">{item.quantity}</td>
              <td className="px-2 py-1 border">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loadingUser && <p>Loading user info...</p>}
    </div>
  );
};

export default OrderDetailPage;
