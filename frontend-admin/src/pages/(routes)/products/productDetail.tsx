import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/types/type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: products,
    loading,
    updateItem,
  } = useApi<Product>({
    endpoint: `/products/${id}`,
    transform: (res) => (res ? [res] : []), // your useApi currently expects an array
  });

  const product = products?.[0];
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    if (product?.inventory) {
      setPrice(product.inventory.price);
      setStock(product.inventory.stock);
    }
  }, [product]);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  const handleUpdateInventory = async () => {
    if (!product.inventory) return;

    const payload: Partial<Product> = {
      ...product,
      inventory: {
        ...product.inventory, // preserve id, createdAt, updatedAt
        price,
        stock,
      },
    };

    try {
      await updateItem(product.id, payload, "/products");
      toast.success("Inventory updated successfully");
    } catch (err) {
      toast.error("Failed to update inventory");
    }
  };

  return (
    <div className="p-6  space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <div className="flex flex-col gap-4 ">
        <img
          src={product.image}
          alt={product.name}
          className="w-48 h-48 rounded-md object-cover"
        />
        <div>
          <p>
            <strong>Description:</strong> {product.desc}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(product.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold">Edit Inventory</h2>
        <div className="flex gap-2 items-center">
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label>Stock: </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdateInventory}>Update Inventory</Button>
          <Button variant="outline" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
