"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/store/useDebounce";

const SearchBar = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  // Initialize search value from URL
  useEffect(() => {
    const searchQuery = searchParams.get("name") || "";
    setValue(searchQuery);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove search parameter
    if (debouncedValue) {
      params.set("name", debouncedValue);
    } else {
      params.delete("name");
    }

    // Preserve all other filter parameters (category, price, sort, etc.)
    const url = `${pathName}?${params.toString()}`;
    router.push(url);
  }, [router, searchParams, debouncedValue, pathName]);

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-base"
        placeholder="Search for products..."
      />
    </div>
  );
};

export default SearchBar;
