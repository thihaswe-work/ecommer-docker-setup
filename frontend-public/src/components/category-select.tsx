"use client";
// chatgpt
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/types";

export default function CategoryDropdown({
  categories,
}: {
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultparams = searchParams.getAll("category");

  const allIds = categories.map((c) => c.id);

  // Initially, nothing selected
  const initialSelected: number[] =
    defaultparams.length > 0 ? defaultparams.map(Number) : [];

  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] =
    useState<number[]>(initialSelected);
  const [tempSelected, setTempSelected] = useState<number[]>(initialSelected);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setTempSelected(selectedCategories);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCategories]);

  const handleToggle = (id: number) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    setSelectedCategories(tempSelected);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");

    if (tempSelected.length > 0) {
      tempSelected.forEach((id) => params.append("category", String(id)));
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  return (
    <div className="flex gap-2 flex-row-reverse justify-end ">
      {/* Selected Tags */}
      <div className="flex gap-2">
        {selectedCategories.length === 0 ||
        selectedCategories.length === categories.length ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-300 text-gray-800 rounded-full text-sm">
            All
          </div>
        ) : (
          categories
            .filter((c) => selectedCategories.includes(c.id))
            .map((cat) => (
              <span
                key={cat.id}
                className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded-full text-sm"
              >
                {cat.name}
                <button
                  onClick={() => {
                    setSelectedCategories((prev) =>
                      prev.filter((c) => c !== cat.id)
                    );
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("category");
                    setSelectedCategories((prev) =>
                      prev.filter((c) => c !== cat.id)
                    );
                    setTempSelected((prev) => prev.filter((c) => c !== cat.id));
                    if (selectedCategories.length > 1)
                      selectedCategories
                        .filter((c) => c !== cat.id)
                        .forEach((id) => params.append("category", String(id)));
                    router.push(`?${params.toString()}`);
                  }}
                  className="ml-1 font-bold text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))
        )}
      </div>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Button onClick={() => setOpen(!open)}>Select categories</Button>

        {open && (
          <div className="absolute mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
            {/* Individual categories */}
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={tempSelected.includes(cat.id)}
                  onCheckedChange={() => handleToggle(cat.id)}
                />
                <span>{cat.name}</span>
              </label>
            ))}

            {/* Clear button */}
            <Button variant={"outline"} onClick={handleClear}>
              Clear
            </Button>

            {/* Confirm button */}
            <Button onClick={handleConfirm} variant="default" className="mt-2">
              OK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
