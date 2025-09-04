"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import type { SortOption } from "@/types";

interface QuickFiltersProps {
  categories: Array<{ id: string; name: string }>;
}

const QuickFilters = ({ categories }: QuickFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as SortOption) || "newest";
  const currentCategory = searchParams.get("category") || "";

  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "" && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "name-asc", label: "A to Z" },
    { value: "name-desc", label: "Z to A" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
  ];

  const getCurrentSortLabel = () => {
    return (
      sortOptions.find((option) => option.value === currentSort)?.label ||
      "Newest First"
    );
  };

  const getCurrentCategoryLabel = () => {
    if (!currentCategory) return "All Categories";
    return (
      categories.find((cat) => cat.id === currentCategory)?.name ||
      "All Categories"
    );
  };

  const handleCategoryChange = (value: string) => {
    const categoryValue = value === "all" ? null : value;
    updateURL("category", categoryValue);
  };

  const handleSortChange = (value: string) => {
    const sortValue = value === "newest" ? null : value;
    updateURL("sort", sortValue);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6 md:hidden">
      {/* Category Quick Filter - Mobile Only */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <span className="truncate">{getCurrentCategoryLabel()}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => handleCategoryChange("all")}>
            All Categories
          </DropdownMenuItem>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Quick Filter - Mobile Only */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span className="truncate">{getCurrentSortLabel()}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default QuickFilters;
