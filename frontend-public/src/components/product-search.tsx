"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ProductSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("query") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const order = searchParams.get("order") || "ASC";
  const [orderValue, setOrderValue] = useState(order);

  const categoryParams = searchParams.getAll("category");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("query", term);
    else params.delete("query");
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleReset = () => {
    const params = new URLSearchParams();
    categoryParams.forEach((cat) => params.append("category", cat));
    router.replace(`${pathname}?${params.toString()}`);
    formRef.current?.reset();
    setOrderValue("ASC");
  };

  useEffect(() => {
    if (searchParams.get("focus") === "true") {
      inputRef.current?.focus();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("focus");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current!);
        const params = new URLSearchParams();

        categoryParams.forEach((cat) => params.append("category", cat));
        const queryVal = formData.get("query") as string;
        const minVal = formData.get("min") as string;
        const maxVal = formData.get("max") as string;

        if (queryVal) params.set("query", queryVal);
        if (minVal) params.set("min", minVal);
        if (maxVal) params.set("max", maxVal);
        params.set("order", orderValue);

        router.replace(`${pathname}?${params.toString()}`);
      }}
      className="grid gap-3 sm:gap-4 md:gap-5 
                 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-8
                 mb-10 items-center"
    >
      {/* Search input */}
      <div className="relative col-span-1 sm:col-span-2 md:col-span-2 xl:col-span-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          name="query"
          placeholder="Search products..."
          className="pl-10"
          defaultValue={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Min / Max price */}
      <Input
        className="col-span-1 xl:col-span-1"
        type="number"
        name="min"
        placeholder="Min Price"
        defaultValue={min}
      />
      <Input
        className="col-span-1 xl:col-span-1"
        type="number"
        name="max"
        placeholder="Max Price"
        defaultValue={max}
      />

      {/* Order select */}
      <div className="col-span-1 xl:col-span-1">
        <Select value={orderValue} onValueChange={setOrderValue} name="order">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">ASC</SelectItem>
            <SelectItem value="DESC">DESC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap col-span-1 xl:col-span-2 gap-2 sm:gap-3 justify-end">
        <Button type="submit" className="flex-1 sm:flex-none w-full sm:w-auto">
          <Search className="mr-1 h-4 w-4" /> Search
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:flex-none w-full sm:w-auto"
          onClick={handleReset}
        >
          <X className="mr-1 h-4 w-4" /> Reset
        </Button>
      </div>
    </form>
  );
}
