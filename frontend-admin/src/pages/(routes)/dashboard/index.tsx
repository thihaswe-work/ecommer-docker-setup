import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import type { Order, OrderItem } from "@/types/type";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardPage = () => {
  const [sortAsc, setSortAsc] = useState(false);
  const { theme } = useThemeStore(); // get current theme
  const isDark = theme === "dark";

  // const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const { data: orders, loading } = useApi<Order>({
    endpoint: "/orders",
    transform: (res) => res || [],
  });

  if (loading) return <div>Loading dashboard...</div>;

  // Status counts
  const statusOrder = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // Top products (sold items count)
  const productCounts: Record<string, number> = {};
  orders.forEach((o) => {
    o.orderItems?.forEach((item: OrderItem) => {
      productCounts[item.productName] =
        (productCounts[item.productName] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const chartData = topProducts.map(([name, qty]) => ({ name, qty }));

  // Top customers
  const customerCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const customer = o.customerId;
    customerCounts[customer] = (customerCounts[customer] || 0) + 1;
  });
  const topCustomers = Object.entries(customerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Chart colors based on theme
  const barColor = isDark ? "#818cf8" : "#4f46e5"; // lighter in dark mode
  const axisColor = isDark ? "#f3f4f6" : "#111827"; // light for dark mode, dark for light mode

  return (
    <div className="p-6 bg-background text-foreground min-h-screen space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome, {user?.firstName || "User"}!</p>
      <img
        src={user?.avatar}
        alt="user image"
        width={100}
        height={100}
        className="rounded-full object-cover"
      />

      {/* Orders by Status */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Orders by Status</h2>
        <Table className="border border-border rounded-md">
          <TableHeader>
            <TableRow className="border-b border-border">
              {statusOrder.map((status) => (
                <TableHead
                  key={status}
                  className={`capitalize font-semibold text-center border-r border-border last:border-r-0 ${
                    statusColors[status] || ""
                  }`}
                >
                  {status}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-t border-border">
              {statusOrder.map((status) => (
                <TableCell
                  key={status}
                  className={`text-center border-r border-border last:border-r-0 bg-muted`}
                >
                  {statusCounts[status] || 0}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Top Customers */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Top 3 Customers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>
                <button
                  onClick={() => setSortAsc((prev) => !prev)}
                  className="flex items-center gap-1"
                >
                  Orders {sortAsc ? "↑" : "↓"}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCustomers
              .slice()
              .sort((a, b) => (sortAsc ? a[1] - b[1] : b[1] - a[1]))
              .map(([id, count]) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Top 10 Products Sold - Recharts Bar Chart */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Top 10 Products Sold</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                  color: isDark ? "#f3f4f6" : "#111827",
                }}
              />
              <Bar dataKey="qty" fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for top products.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
