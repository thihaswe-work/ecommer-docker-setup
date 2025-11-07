import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
interface Field {
  name: string;
  label: string;
  type?: string; // text, number, etc.
  required?: boolean; // default false
  dropdown?: any[];
}

interface EntityFormProps<T extends object> {
  open: boolean;
  title: string;
  fields: Field[];
  initialData?: Partial<T> | null;
  onClose: () => void;
  onSubmit: (values: Partial<T>) => void;
}

export function EntityForm<T extends object>({
  open,
  title,
  fields,
  initialData,
  onClose,
  onSubmit,
}: EntityFormProps<T>) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const filled = Object.fromEntries(
        fields.map((f) => {
          if (f.name === "categoryId") {
            // If it's categoryId, find the category name from the dropdown options
            const categoryName = f.dropdown?.find(
              (cat: any) => cat.id === (initialData as any)["category"]["id"]
            )?.name;

            return [f.name, categoryName || ""]; // Set the category name
          }
          return [f.name, String((initialData as any)[f.name] ?? "")];
        })
      );
      setForm(filled);
    } else {
      setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
    }
    setErrors({});
  }, [initialData, fields]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      const value = form[f.name];
      if (
        (f.required ?? false) &&
        (typeof value === "string"
          ? !value.trim()
          : value === undefined || value === null)
      ) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const parsed = Object.fromEntries(
      fields.map((f) => {
        if (f.name === "categoryId") {
          // find the selected category by name in the dropdown
          const selectedCategory = f.dropdown?.find(
            (cat: any) => cat.name === form[f.name] // form[f.name] stores the category name
          );
          return [f.name, selectedCategory ? selectedCategory.id : null];
        }

        return [
          f.name,
          f.type === "number" ? Number(form[f.name]) : form[f.name],
        ];
      })
    );
    onSubmit(parsed as Partial<T>);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {fields.map((f) => {
            const isRequired = f.required ?? false;
            if (f.dropdown) {
              return (
                <div key={f.name} className="flex flex-col">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {form[f.name]
                          ? f.dropdown?.find((opt) => opt.name === form[f.name])
                              ?.name
                          : "Select a category"}
                        <ChevronDown className="ml-2 w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                      {f.dropdown?.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          onClick={() => {
                            setForm({ ...form, [f.name]: option.name });
                            if (errors[f.name]) {
                              setErrors({ ...errors, [f.name]: "" });
                            }
                          }}
                        >
                          {option.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors[f.name] && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors[f.name]}
                    </span>
                  )}
                </div>
              );
            }
            return (
              <div key={f.name} className="flex flex-col">
                <Input
                  type={f.type || "text"}
                  placeholder={f.label + (isRequired ? " *" : "")}
                  value={form[f.name] || ""}
                  onChange={(e) => {
                    setForm({ ...form, [f.name]: e.target.value });
                    // remove error on change
                    if (errors[f.name]) {
                      setErrors({ ...errors, [f.name]: "" });
                    }
                  }}
                  className={errors[f.name] ? "border-red-500" : ""}
                />
                {errors[f.name] && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors[f.name]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
