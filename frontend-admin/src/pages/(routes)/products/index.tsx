"use client";

import { ArrowUpDown } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmationDialog";
import { DataTable } from "@/components/DataTable";
import { EntityForm } from "@/components/EntityForm";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/types/type";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  CopyIcon,
  ListChevronsDownUp,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const { data: categories, loading: categoryLoading } = useApi<any>({
    endpoint: "/categories",
    // transform(data) {
    //   return data.data;
    // },
  });
  const { data, loading, removeItem, createItem, updateItem } = useApi<any>({
    endpoint: "/products",
    // transform(data) {
    //   return data.data;
    // },
  });

  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const columns: ColumnDef<Product>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    // },

    {
      accessorKey: "name",
      header: "Name",
      cell(props) {
        return (
          <div className="line-clamp-3 max-w-sm text-wrap">
            {props.row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div>
            <img
              src={row.getValue("image") as string}
              alt="product image"
              width={0}
              height={0}
              className="rounded-full w-10 h-10"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "desc",
      header: "Description",
      cell(props) {
        return (
          <div className="line-clamp-3 max-w-xl text-wrap">
            {props.row.getValue("desc")}
          </div>
        );
      },
    },
    // {
    //   header: "Price",
    //   cell: ({ row }) => {
    //     const product = row.original as Product;
    //     const price = product.inventory?.price ?? 0;
    //     return (
    //       <div className="font-medium">
    //         {new Intl.NumberFormat("en-US", {
    //           style: "currency",
    //           currency: "USD",
    //         }).format(price)}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "inventory.price", // points to nested inventory price
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const inventory = row.original.inventory;
        const price = inventory?.price ?? 0; // fallback if inventory is undefined
        return (
          <div className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original;
        const status = product.status; // boolean
        const statusColor = status
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${statusColor}`}
              >
                <span className="px-2 py-1 rounded text-xs font-medium">
                  {status ? "Active" : "Inactive"}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>

            {/* Match width of trigger button */}
            <DropdownMenuContent align="start" className="w-full min-w-[120px]">
              {[true, false].map((s) => (
                <DropdownMenuItem
                  key={String(s)}
                  className="w-full flex justify-center"
                  onClick={async () => {
                    if (status !== s) {
                      await updateItem(product.id, { status: s });
                      toast(
                        <span>
                          Product has been{" "}
                          <span
                            className={
                              s
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {s ? "Activated" : "Deactivated"}
                          </span>
                        </span>
                      );
                    }
                  }}
                >
                  <div
                    className={`w-full text-center px-2 py-1 rounded text-xs font-medium ${
                      s
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {s ? "Active" : "Inactive"}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      // header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(product.name);
                toast.success("Product name has been copied");
              }}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>{" "}
            {/* 👁 View Details */}
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <ListChevronsDownUp className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setEditing(product);
                setFormOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setDeleteTarget(product)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading && categoryLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Product
        </Button>
      </div>

      <DataTable columns={columns} data={data} />

      {/* Form */}
      <EntityForm<Product>
        open={formOpen}
        title={editing ? "Edit Product" : "Create Product"}
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "desc", label: "Description", required: true },
          // { name: "price", label: "Price", type: "number", required: true },
          { name: "image", label: "Image" },
          // { name: "stock", label: "Stock", type: "number" },
          {
            name: "categoryId",
            label: "Category",
            required: true,
            // Enable dropdown for this field
            dropdown: categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
            })),
          },
        ]}
        initialData={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={async (values) => {
          if (editing) {
            await updateItem(editing.id, values);
          } else {
            const data = await createItem(values);
            navigate(`/products/${data.id}`);
          }
          setFormOpen(false);
          setEditing(null);
        }}
      />

      {/* Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
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
