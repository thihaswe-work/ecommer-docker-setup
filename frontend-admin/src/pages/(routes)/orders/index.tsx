// import { useApi } from "@/hooks/useApi";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";

// export interface Order {
//   productId: string;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   price: number;
// }

// const OrdersPage = () => {
//   const { data: orders, loading } = useApi<Order>({ endpoint: "/orders" });

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Orders</h1>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Id</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Image</TableHead>
//             <TableHead>Price</TableHead>
//             <TableHead>Quantity</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {orders.map((order) => (
//             <TableRow key={order.productId}>
//               <TableCell>{order.productId}</TableCell>
//               <TableCell>{order.productName}</TableCell>
//               <TableCell>
//                 {order.productImage ? (
//                   <img
//                     src={order.productImage}
//                     alt={order.productName}
//                     className="w-10 h-10 rounded mx-auto"
//                   />
//                 ) : (
//                   "N/A"
//                 )}
//               </TableCell>
//               <TableCell>${order.price.toLocaleString()}</TableCell>
//               <TableCell>{order.quantity}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => console.log("Delete", order.productId)}
//                 >
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}

//           {orders.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={6} className="text-center text-gray-500">
//                 No orders found.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default OrdersPage;
import { ConfirmDialog } from "@/components/ConfirmationDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/useApi";
import type { Order } from "@/types/type";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  CopyIcon,
  ListChevronsDownUp,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function OrdersPage() {
  const { data, loading, removeItem, updateItem } = useApi<Order>({
    endpoint: "/orders",
  });
  const navigate = useNavigate();

  // const [formOpen, setFormOpen] = useState(false);
  // const [editing, setEditing] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  // Status options array typed
  const statusOptions: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "customerId", header: "Customer ID" },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <div className=" font-medium">
          ${(row.getValue("total") as number).toFixed(2)}
        </div>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        const status = row.getValue("status") as string;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1  
                  hover:${statusColors[status]} ${statusColors[status]}`}
              >
                <span
                  className={`px-2 py-1 rounded text-xs font-medium w-18 hover:${statusColors[status]}`}
                >
                  {order.status}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={async () => {
                    // TODO: call your API to update statusconst
                    const colorClass =
                      statusColors[status] || "bg-gray-100 text-gray-800";
                    if (order.status !== status) {
                      await updateItem(order.id, { status });
                      toast(
                        <span>
                          Order Status Changed to{" "}
                          <span
                            className={`${colorClass
                              .replace("bg-", "")
                              .replace("text-", "text-")}`}
                          >
                            {status}
                          </span>
                        </span>
                      );
                    }
                  }}
                >
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(order.id);
                toast.success("OrderId copied to clipboard");
              }}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
            {/* 👁 View Details */}
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <ListChevronsDownUp className="w-4 h-4" />
            </Button>
            {/* 🗑 Delete */}
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setDeleteTarget(order)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <DataTable columns={columns} data={data} />

      {/* Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Order"
        description={`Are you sure you want to delete order #${deleteTarget?.id}?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await removeItem(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
