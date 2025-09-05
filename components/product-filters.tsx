"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { X, Tag, DollarSign, ArrowUpDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DoubleRangeSlider from "@/components/ui/double-range-slider";
import { formatPrice } from "@/lib/utils";
import { useDebounce } from "@/store/useDebounce";
import type { SortOption } from "@/types";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

const ProductFilters = ({ categories }: ProductFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showNewOnly, setShowNewOnly] = useState<boolean>(false);

  // UI states
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Debounce price range changes to avoid excessive API calls
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const sortParam = (searchParams.get("sort") as SortOption) || "newest";
    const newOnlyParam = searchParams.get("newOnly") === "true";

    setSelectedCategory(category);

    // Initialize price range
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : 0;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : 10000;
    setPriceRange([minPrice, maxPrice]);

    setSortBy(sortParam);
    setShowNewOnly(newOnlyParam);
  }, [searchParams]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 10000) count++;
    if (showNewOnly) count++;
    if (sortBy !== "newest") count++;
    setActiveFiltersCount(count);
  }, [selectedCategory, debouncedPriceRange, showNewOnly, sortBy]);

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      setIsUpdating(true);

      const params = new URLSearchParams(searchParams.toString());

      // Keep the search query if it exists
      const currentSearch = searchParams.get("name");
      if (currentSearch) {
        params.set("name", currentSearch);
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`);

      // Reset updating state after a short delay
      setTimeout(() => setIsUpdating(false), 150);
    },
    [router, pathname, searchParams]
  );

  // Update URL when debounced price range changes
  useEffect(() => {
    const [minPrice, maxPrice] = debouncedPriceRange;
    updateURL({
      minPrice: minPrice > 0 ? minPrice.toString() : null,
      maxPrice: maxPrice < 10000 ? maxPrice.toString() : null,
    });
  }, [debouncedPriceRange, updateURL]);

  const handleCategoryChange = (value: string) => {
    const categoryValue = value === "all" ? "" : value;
    setSelectedCategory(categoryValue);
    updateURL({ category: categoryValue || null });
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    updateURL({ sort: value === "newest" ? null : value });
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    // URL update happens via useEffect with debounced value
  };

  const handleNewOnlyToggle = () => {
    const newValue = !showNewOnly;
    setShowNewOnly(newValue);
    updateURL({ newOnly: newValue ? "true" : null });
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 10000]);
    setSortBy("newest");
    setShowNewOnly(false);

    // Keep only the search query
    const params = new URLSearchParams();
    const currentSearch = searchParams.get("name");
    if (currentSearch) {
      params.set("name", currentSearch);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
  ];

  return (
    <div className="w-full mb-8">
      {/* Filter Bar */}
      <div
        className={`flex flex-col lg:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border transition-opacity duration-150 ${
          isUpdating ? "opacity-70" : "opacity-100"
        }`}
      >
        {/* Quick Sort & Category - Always Visible */}
        <div className="flex flex-1 gap-3">
          {/* Sort */}
          <div className="flex-1 lg:max-w-48">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-10">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="flex-1 lg:max-w-52">
            <Select
              value={selectedCategory || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-10">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center gap-3">
          {/* New Products Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <Label
              htmlFor="newOnly"
              className="text-sm font-medium cursor-pointer"
              title="Show products added within the last 30 days"
            >
              New
            </Label>
            <Switch
              id="newOnly"
              checked={showNewOnly}
              onCheckedChange={handleNewOnlyToggle}
            />
          </div>

          {/* Price Range Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 ${
                  priceRange[0] > 0 || priceRange[1] < 10000
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Price Range
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <Badge variant="secondary" className="ml-2 h-5">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="text-sm font-medium">Set Price Range</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Changes apply automatically after you stop adjusting
                </div>
                <DoubleRangeSlider
                  min={0}
                  max={10000}
                  step={50}
                  minGap={100}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  formatLabel={(value) => formatPrice(value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {formatPrice(priceRange[0])}</span>
                  <span>Max: {formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-10 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Active filters:
            </span>
            {selectedCategory && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700"
              >
                Category:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleCategoryChange("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 10000) && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700"
              >
                Price: {formatPrice(debouncedPriceRange[0])} -{" "}
                {formatPrice(debouncedPriceRange[1])}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => setPriceRange([0, 10000])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {showNewOnly && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700"
              >
                New Products Only
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={handleNewOnlyToggle}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {sortBy !== "newest" && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700"
              >
                Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleSortChange("newest")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
